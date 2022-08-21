import { IOutcomeInfo } from 'dataforged'
import { capitalize, compact } from 'lodash'
import { IronswornRoll } from '.'
import { IronswornActor } from '../actor/actor'
import { getFoundryTableByDfId } from '../dataforged'
import { SFMoveDataProperties } from '../item/itemtypes'
import { ROLL_OUTCOME } from './roll'
import { renderRollGraphic } from './roll-graphic'

function resolveIronswornRoll(a: number, c1: number, c2: number): ROLL_OUTCOME {
  if (a <= Math.min(c1, c2)) return ROLL_OUTCOME.MISS
  if (a > Math.max(c1, c2)) return ROLL_OUTCOME.STRONG_HIT
  return ROLL_OUTCOME.WEAK_HIT
}

function momentumBurnIsValid(
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

function outcomeText(outcome: ROLL_OUTCOME, match: boolean): RollOutcomeKey {
  let key: RollOutcomeKey = outcome
  if (match) {
    key += '_match'
  }
  return game.i18n.localize('IRONSWORN.' + key) as RollOutcomeKey
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
      value: resolveIronswornRoll(momentum, c1, c2),
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
    // Things with custom labels will still need
    // Roll +{X} for some things will be tricky, e.g. assets where the user sets the label
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
    const keys = {
      [ROLL_OUTCOME.MISS]: 'Miss',
      [ROLL_OUTCOME.WEAK_HIT]: 'Weak Hit',
      [ROLL_OUTCOME.STRONG_HIT]: 'Strong Hit',
    }
    const key = keys[theOutcome]
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
    const momentumOutcome = resolveIronswornRoll(momentum, c1, c2)

    // compare this.roll.rawOutcome?.value
    // and momentumOutcome

    switch (momentumBurnIsValid(this.roll.rawOutcome?.value, momentumOutcome)) {
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
