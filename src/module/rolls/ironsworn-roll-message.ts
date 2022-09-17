import { IOutcomeInfo, RollMethod } from 'dataforged'
import { capitalize, compact, fromPairs, isUndefined, kebabCase } from 'lodash'
import { IronswornRoll } from '.'
import { IronswornActor } from '../actor/actor'
import { getFoundryTableByDfId } from '../dataforged'
import { SFMoveDataProperties } from '../item/itemtypes'
import { DfRollOutcome, RollOutcome } from './ironsworn-roll'
import { renderRollGraphic } from './roll-graphic'

type MoveTemplateData = {
  outcomeClass?: string
  outcomeText?: string
  outcomeReplacementReason?: string
  moveOutcome?: string
}

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
 * Composes a localized string describing the stat options available to a particular move trigger. Falls back to {@link formatRollPlusStat} when there's only one stat available.
 * @param rollMethod The Dataforged roll method to generate a string for.
 * @param stats One or more stat strings.
 * @example formatRollMethod("Highest", ["Spirit", "Heart"])
 * // returns "roll +wits or +iron, whichever is higher" for en.json
 * @example formatRollMethod("Highest", ["Spirit", "Heart", "Wits"])
 * // returns "roll highest of spirit, heart, wits" for en.json
 */
export function formatRollMethod(rollMethod: RollMethod, stats: string[]) {
  // skip if there's no choice to be made
  if (stats.length === 1) {
    return formatRollPlusStat(stats[0])
  }
  // canonical triggers have 2 stats; there's a good chance a nice string already exists, so we check for that first.
  const localizedStats = stats.map((stat) =>
    game.i18n.localize('IRONSWORN.' + capitalize(stat))
  )
  const methodKeyRoot = `IRONSWORN.roll method.${rollMethod}`
  const possibleNiceKey = `${methodKeyRoot}.${stats.length}`
  if (game.i18n.has(possibleNiceKey)) {
    /**
     * @example {stat1: "iron", stat2: "health"}
     */
    const statStringHash = fromPairs(
      localizedStats.map((stat, index) => [`stat${index + 1}`, stat])
    )
    return game.i18n.format(possibleNiceKey, statStringHash)
  }
  const fallbackKey = `${methodKeyRoot}.fallback`

  // TODO: figure out if the separator would differ in some languages?
  const separator = ', '
  const statList = localizedStats.join(separator)
  return game.i18n.format(fallbackKey, {
    statList,
  })
}

/**
 * Computes the outcome of an Ironsworn action roll or progress roll.
 * @param score The score (e.g. action score or progress score) to compare to the challenge dice.
 * @param challengeDie1 The value of the first challenge die.
 * @param challengeDie2 The value of the second challenge die.
 */
export function computeRollOutcome(
  score: number,
  challengeDie1: number,
  challengeDie2: number
): RollOutcome {
  return [challengeDie1, challengeDie2].filter(
    (challengeDie) => score > challengeDie
  ).length
}

/**
 * Retrieves a localized string corresponding to a provided roll outcome.
 * @param outcome The numeric outcome value to retrieve the string for.
 * @param match Whether or not the outcome has matched challenge dice.
 */
export function computeOutcomeText(
  outcome: RollOutcome | DfRollOutcome,
  match?: boolean | undefined
) {
  let outcomeKey = RollOutcome[outcome]
  if (match) {
    outcomeKey += '_match'
  }
  return game.i18n.localize(`IRONSWORN.${outcomeKey}`)
}

/**
 * Will burning momentum improve the outcome of an Ironsworn action roll?
 * @param rawOutcome The outcome before burning momentum.
 * @param momentumOutcome The outcome after burning momentum.
 */
export function momentumBurnWouldUpgrade(
  rawOutcome: RollOutcome | undefined,
  momentumOutcome: RollOutcome
) {
  return rawOutcome ? momentumOutcome > rawOutcome : false
}

type i18nOutcomeKey =
  | `${keyof typeof RollOutcome}`
  | `${keyof typeof RollOutcome}_match`

export function outcomeKey(
  outcome: RollOutcome,
  match: boolean
): i18nOutcomeKey {
  let key: i18nOutcomeKey = RollOutcome[outcome] as keyof typeof RollOutcome
  if (match) {
    key += '_match'
  }
  return key as i18nOutcomeKey
}

export class IronswornRollMessage {
  constructor(public roll: IronswornRoll, public actor?: IronswornActor) {
    if (!actor && roll.preRollOptions.actorId) {
      this.actor = game.actors?.get(roll.preRollOptions.actorId)
    }
  }

  static async fromMessage(
    messageId: string
  ): Promise<IronswornRollMessage | undefined> {
    const msg = game.messages?.get(messageId)
    const html = await msg?.getHTML()

    // Reconstitute roll
    const json = html?.find('.ironsworn-roll').data('ironswornroll')
    if (!json) return undefined

    const r = IronswornRoll.fromJson(json)
    r.chatMessageId = messageId
    r.roll = msg?.roll || undefined

    return new IronswornRollMessage(r)
  }

  async burnMomentum() {
    if (this.actor?.data.type !== 'character') return
    const { momentum } = this.actor.data.data

    const [c1, c2] = this.roll.finalChallengeDice ?? []
    if (c1 === undefined || c2 === undefined) return

    await this.actor.burnMomentum()
    this.roll.postRollOptions.replacedOutcome = {
      value: computeRollOutcome(momentum, c1.value, c2.value),
      source: game.i18n.localize('IRONSWORN.MomentumBurnt'),
    }
    return this.createOrUpdate()
  }

  async createOrUpdate() {
    await this.roll.evaluate()

    // console.log('sent renderData', renderData)
    const renderData = {
      graphic: await renderRollGraphic({ roll: this.roll, hideOutcome: true }),
      ironswornroll: this.roll.serialize(),
      move: await this.roll.moveItem,
      ...(await this.titleData()),
      ...(await this.moveData()),
      ...(await this.challengeDiceData()),
      ...(await this.momentumData()),
      ...(await this.oraclesData()),
    }
    const content = await renderTemplate(
      'systems/foundry-ironsworn/templates/rolls/ironsworn-roll-message.hbs',
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

  private async titleData(): Promise<{
    title: string
  }> {
    const move = await this.roll.moveItem

    const { progress, stat } = this.roll.preRollOptions
    if (progress) {
      const prefix = move?.name || game.i18n.localize('IRONSWORN.ProgressRoll')
      return {
        title: `${prefix}: ${progress.source}`,
      }
    }

    if (!stat) throw new Error('Need progress or stat here')

    if (move) {
      return { title: `${move.name} +${stat.source}` }
    }
    let localizedStat = game.i18n.localize(
      'IRONSWORN.' + capitalize(stat.source)
    )
    if (localizedStat.startsWith('IRONSWORN.')) localizedStat = stat.source
    return {
      title: game.i18n.format('IRONSWORN.roll +x', { stat: localizedStat }),
    }
  }

  private async moveData(): Promise<MoveTemplateData> {
    // Outcome can be overridden
    const theOutcome = this.roll.finalOutcome?.value
    if (theOutcome === undefined) return {}

    // Original outcome
    const ret: MoveTemplateData = {
      outcomeText: computeOutcomeText(theOutcome, this.roll.isMatch),
      outcomeClass: `${kebabCase(RollOutcome[theOutcome])}${
        this.roll.isMatch ? ' match' : ''
      }`,
      outcomeReplacementReason:
        this.roll.postRollOptions.replacedOutcome?.source,
    }
    const move = await this.roll.moveItem
    if (move?.data.type !== 'sfmove') return ret

    const key = DfRollOutcome[theOutcome]
    let dfOutcome = move.data.data.Outcomes?.[key] as IOutcomeInfo
    if (this.roll.isMatch && dfOutcome?.['With a Match']?.Text)
      dfOutcome = dfOutcome['With a Match']
    if (dfOutcome) {
      ret.moveOutcome = dfOutcome.Text
    }
    return ret
  }

  private challengeDiceData() {
    // Only continue if this roll needs manual resolution
    if (!this.roll.preRollOptions.extraChallengeDice) return {}
    const { replacedChallenge1, replacedChallenge2 } = this.roll.postRollOptions
    if (replacedChallenge1 && replacedChallenge2) return {}

    return {
      unresolved: true,
    }
  }

  private momentumData() {
    if (this.actor?.data.type !== 'character') return {}

    // Can't burn momentum on progress rolls
    if (this.roll.preRollOptions.progress) return {}

    // If momentum has already been burnt, do not suggest more burns
    if (this.roll.postRollOptions.replacedOutcome) return {}

    const [c1, c2] = this.roll.finalChallengeDice ?? []
    if (c1 === undefined || c2 === undefined) return {}

    const momentum = this.actor.data.data.momentum
    const rawOutcome = this.roll.rawOutcome?.value
    const momentumBurnOutcome = computeRollOutcome(momentum, c1.value, c2.value)

    if (!isUndefined(rawOutcome) && momentumBurnOutcome > rawOutcome) {
      return {
        possibleMomentumBurn: computeOutcomeText(
          momentumBurnOutcome,
          c1.value === c2.value
        ),
      }
    }
    return {}
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
