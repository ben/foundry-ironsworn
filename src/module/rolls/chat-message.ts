import { IOutcomeInfo } from 'dataforged'
import { capitalize, compact, isUndefined } from 'lodash'
import { IronswornRoll } from '.'
import { IronswornActor } from '../actor/actor'
import { getFoundryTableByDfId } from '../dataforged'
import { SFMoveDataProperties } from '../item/itemtypes'
import { ROLL_OUTCOME } from './roll'
import { renderRollGraphic } from './roll-graphic'

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
): ROLL_OUTCOME {
  return [challengeDie1, challengeDie2].filter(
    (challengeDie) => score > challengeDie
  ).length
}

/**
 * Will burning momentum improve the outcome of an Ironsworn action roll?
 * @param rawOutcome The outcome before burning momentum.
 * @param momentumOutcome The outcome after burning momentum.
 */
export function momentumBurnWouldUpgrade(
  rawOutcome: ROLL_OUTCOME | undefined,
  momentumOutcome: ROLL_OUTCOME
) {
  return rawOutcome ? momentumOutcome > rawOutcome : false
}

type i18nOutcomeKey =
  | `${keyof typeof ROLL_OUTCOME}`
  | `${keyof typeof ROLL_OUTCOME}_match`

export function outcomeKey(
  outcome: ROLL_OUTCOME,
  match: boolean
): i18nOutcomeKey {
  let key: i18nOutcomeKey = ROLL_OUTCOME[outcome] as keyof typeof ROLL_OUTCOME
  if (match) {
    key += '_match'
  }
  return key as i18nOutcomeKey
}

export function outcomeText(outcome: ROLL_OUTCOME, match: boolean) {
  return game.i18n.localize('IRONSWORN.' + outcomeKey(outcome, match))
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

    let plusStat = game.i18n.localize('IRONSWORN.' + capitalize(stat.source))
    // FIXME: oof. so, "roll" is a tricky word since in english it can function as a verb or a noun. it gets even more complicated when you introduce grammatical gender and word order.
    // ultimately, each stat needs own "roll +X" string - the verb 'roll' might be conjugated differently in languages with grammatical gender (a bit under half of them), or in languages that use a word order other than subject-verb-object (a bit *over* half of them)
    // it might be possible to infer this from existing translations of e.g. assets.
    // Things with custom labels will still need a roll +{x} fallback, tho
    if (plusStat.startsWith('IRONSWORN.')) plusStat = stat.source
    return { title: `${game.i18n.localize('IRONSWORN.Roll')} +${plusStat}` }
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
    const dfOutcomeKeys = {
      [ROLL_OUTCOME.Miss]: 'Miss',
      [ROLL_OUTCOME.Weak_hit]: 'Weak Hit',
      [ROLL_OUTCOME.Strong_hit]: 'Strong Hit',
    }
    const key = dfOutcomeKeys[theOutcome]
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
    const rawOutcome = this.roll.rawOutcome?.value
    const momentumOutcome = computeRollOutcome(momentum, c1, c2)

    if (!isUndefined(rawOutcome) && momentumOutcome > rawOutcome) {
      return {
        possibleMomentumBurn: outcomeText(momentumOutcome, c1 === c2),
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
