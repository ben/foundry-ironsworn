import { IOutcomeInfo, RollMethod } from 'dataforged'
import { capitalize, compact } from 'lodash'
import { IronswornRoll } from '.'
import { IronswornActor } from '../actor/actor'
import { getFoundryTableByDfId } from '../dataforged'
import { SFMoveDataProperties } from '../item/itemtypes'
import { ROLL_OUTCOME } from './roll'
import { renderRollGraphic } from './roll-graphic'

/**
 * Shortcut for composing a localized string similar to "roll +{stat}".
 * @param stat The stat to use; should be lowercase, or have an initial capital letter.
 * @returns A localized string. If no stat is available it uses the provided string as the stat name instead.
 *  * @example
 * ```typescript
 * formatRollPlusStat("heart")
 * // returns "roll +heart" for en.json
 * ```
 */
export function formatRollPlusStat(stat: string) {
  let localizedStat = game.i18n.localize('IRONSWORN.' + capitalize(stat))
  if (localizedStat.startsWith('IRONSWORN.')) localizedStat = stat
  return game.i18n.format('IRONSWORN.roll +x', { stat: localizedStat })
}

/**
 * Composes a localized string describing the stat options available to a particular move trigger. If there's only one stat available, it falls back to {@link formatRollPlusStat}
 * @param rollMethod The Dataforged roll method to generate a string for.
 * @param stats One or more stat strings.
 * @example
 * ```typescript
 * formatRollMethod("Highest", ["Spirit", "Heart"])
 * // returns "roll highest of spirit, heart" for en.json
 * ```
 */
export function formatRollMethod(rollMethod: RollMethod, stats: string[]) {
  if (stats.length === 1) {
    return formatRollPlusStat(stats[0])
  }
  // TODO: the delimiter might be different for some languages, though not any of the ones we currently have localization data for. this might be addressed with a locale file key later.
  const separator = ', '
  const localizedStats = stats.map((stat) =>
    game.i18n.localize('IRONSWORN.' + capitalize(stat))
  )
  const statList = localizedStats.join(separator)
  return game.i18n.format(`IRONSWORN.roll method.${rollMethod}`, {
    statList,
  })
}

/**
 * Computes the outcome of an Ironsworn action roll or progress roll.
 * @param score The score (e.g. action score or progress score) to compare to the challenge dice.
 * @param challengeDie1 The value of the first challenge die.
 * @param challengeDie2 The value of the second challenge die.
 */
function computeRollOutcome(
  score: number,
  challengeDie1: number,
  challengeDie2: number
): ROLL_OUTCOME {
  if (score <= Math.min(challengeDie1, challengeDie2)) return ROLL_OUTCOME.MISS
  if (score > Math.max(challengeDie1, challengeDie2))
    return ROLL_OUTCOME.STRONG_HIT
  return ROLL_OUTCOME.WEAK_HIT
}

/**
 * Will burning momentum improve the outcome of an Ironsworn action roll?
 * @param rawOutcome The outcome before burning momentum.
 * @param momentumOutcome The outcome after burning momentum.
 */
function momentumBurnWouldUpgrade(
  rawOutcome: ROLL_OUTCOME | undefined,
  momentumOutcome: ROLL_OUTCOME
) {
  switch (true) {
    case rawOutcome === ROLL_OUTCOME.MISS &&
      momentumOutcome === ROLL_OUTCOME.WEAK_HIT:
    case rawOutcome === ROLL_OUTCOME.MISS &&
      momentumOutcome === ROLL_OUTCOME.STRONG_HIT:
    case rawOutcome === ROLL_OUTCOME.WEAK_HIT &&
      momentumOutcome === ROLL_OUTCOME.STRONG_HIT:
      return true
    default:
      return false
  }
}

type RollOutcomeKey = `${ROLL_OUTCOME}` | `${ROLL_OUTCOME}_match`

function outcomeText(outcome: ROLL_OUTCOME, match: boolean) {
  let key: RollOutcomeKey = outcome
  if (match) {
    key += '_match'
  }
  return game.i18n.localize('IRONSWORN.' + key)
}

export class IronswornRollChatMessage {
  constructor(public roll: IronswornRoll, public actor?: IronswornActor) {
    if (!actor && roll.preRollOptions.actorId) {
      this.actor = game.actors?.get(roll.preRollOptions.actorId)
    }
  }

  static async fromMessage(
    messageId: string
  ): Promise<IronswornRollChatMessage | undefined> {
    const msg = game.messages?.get(messageId)
    const html = await msg?.getHTML()

    // Reconstitute roll
    const json = html?.find('.ironsworn-roll').data('ironswornroll')
    if (!json) return undefined

    const r = IronswornRoll.fromJson(json)
    r.chatMessageId = messageId
    r.roll = msg?.roll || undefined

    return new IronswornRollChatMessage(r)
  }

  async burnMomentum() {
    if (this.actor?.data.type !== 'character') return
    const { momentum } = this.actor.data.data

    const [c1, c2] = this.roll.finalChallengeDice ?? []
    if (c1 === undefined || c2 === undefined) return

    await this.actor.burnMomentum()
    this.roll.postRollOptions.replacedOutcome = {
      value: computeRollOutcome(momentum, c1, c2),
      source: game.i18n.localize('IRONSWORN.MomentumBurnt'),
    }
    return this.createOrUpdate()
  }

  async createOrUpdate() {
    await this.roll.evaluate()

    const renderData = {
      graphic: await renderRollGraphic(this.roll.preRollOptions, this.roll),
      ironswornroll: this.roll.serialize(),
      move: await this.roll.moveItem,
      ...(await this.titleData()),
      ...(await this.moveData()),
      ...(await this.momentumData()),
      ...(await this.oraclesData()),
    }
    const content = await renderTemplate(
      'systems/foundry-ironsworn/templates/rolls/chat-message.hbs',
      renderData
    )

    if (this.roll.chatMessageId) {
      const msg = game.messages?.get(this.roll.chatMessageId)
      return msg?.update({ content })
    } else {
      const speaker = ChatMessage.getSpeaker()
      if (this.actor) {
        speaker.actor = this.actor.id
        speaker.alias = this.actor.name || undefined
      }
      const messageData = {
        speaker,
        content,
        type: CONST.CHAT_MESSAGE_TYPES.ROLL,
        roll: this.roll.roll,
      }

      const cls = CONFIG.ChatMessage.documentClass
      const msg = await cls.create(messageData as any, {})
      this.roll.chatMessageId = msg?.id
      return msg
    }
  }

  private async titleData(): Promise<any> {
    const move = await this.roll.moveItem

    const { progress, stat } = this.roll.preRollOptions
    if (progress) {
      return {
        title: `${game.i18n.localize('IRONSWORN.ProgressRoll')}: ${
          progress.source
        }`,
      }
    }

    if (!stat) throw new Error('Need progress or stat here')

    if (move) {
      return { title: `${move.name} (${stat.source})` }
    }
    let localizedStat = game.i18n.localize(
      'IRONSWORN.' + capitalize(stat.source)
    )
    if (localizedStat.startsWith('IRONSWORN.')) localizedStat = stat.source
    return {
      title: game.i18n.format('IRONSWORN.roll +x', { stat: localizedStat }),
    }
  }

  private async moveData(): Promise<any> {
    const move = await this.roll.moveItem
    if (move?.data.type !== 'sfmove') return {}

    // Outcome can be overridden
    const theOutcome =
      this.roll.finalOutcome?.value ?? this.roll.rawOutcome?.value
    if (!theOutcome) return {}

    // Original outcome
    const ret = {
      outcomeText: outcomeText(theOutcome, this.roll.isMatch),
      outcomeReplacementReason:
        this.roll.postRollOptions.replacedOutcome?.source,
    } as any
    const defOutcomeKeys = {
      [ROLL_OUTCOME.MISS]: 'Miss',
      [ROLL_OUTCOME.WEAK_HIT]: 'Weak Hit',
      [ROLL_OUTCOME.STRONG_HIT]: 'Strong Hit',
    }
    const key = defOutcomeKeys[theOutcome]
    let dfOutcome = move.data.data.Outcomes?.[key] as IOutcomeInfo
    if (this.roll.isMatch && dfOutcome?.['With a Match']?.Text)
      dfOutcome = dfOutcome['With a Match']
    if (dfOutcome) {
      ret.moveOutcome = dfOutcome.Text
    }

    return ret
  }

  private momentumData(): any {
    if (this.actor?.data.type !== 'character') return {}

    // Can't burn momentum on progress rolls
    if (this.roll.preRollOptions.progress) return {}

    // If momentum has already been burnt, do not suggest more burns
    if (this.roll.postRollOptions.replacedOutcome) return {}

    const [c1, c2] = this.roll.finalChallengeDice ?? []
    if (c1 === undefined || c2 === undefined) return {}

    const momentum = this.actor.data.data.momentum
    const momentumOutcome = computeRollOutcome(momentum, c1, c2)

    // compare this.roll.rawOutcome?.value
    // and momentumOutcome

    switch (
      momentumBurnWouldUpgrade(this.roll.rawOutcome?.value, momentumOutcome)
    ) {
      case true:
        return {
          possibleMomentumBurn: outcomeText(momentumOutcome, c1 === c2),
        }
      default:
        return {}
    }
  }

  private async oraclesData(): Promise<any> {
    const move = await this.roll.moveItem
    if (move?.type !== 'sfmove') return {}

    const data = move.data as SFMoveDataProperties
    const dfIds = data.data.Oracles ?? []
    const nextOracles = compact(
      await Promise.all(dfIds.map(getFoundryTableByDfId))
    )
    return { nextOracles }
  }
}
