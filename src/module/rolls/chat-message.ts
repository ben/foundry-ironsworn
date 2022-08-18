import { IOutcomeInfo } from 'dataforged'
import { IronswornRoll } from '.'
import { IronswornActor } from '../actor/actor'
import { ROLL_OUTCOME } from './roll'
import { renderRollGraphic } from './roll-graphic'

function rollResult(a: number, c1: number, c2: number): ROLL_OUTCOME {
  if (a <= Math.min(c1, c2)) return ROLL_OUTCOME.MISS
  if (a > Math.max(c1, c2)) return ROLL_OUTCOME.STRONG
  return ROLL_OUTCOME.WEAK
}

function outcomeText(outcome: ROLL_OUTCOME, match: boolean): string {
  let key = 'WeakHit'
  if (outcome === ROLL_OUTCOME.MISS) {
    key = match ? 'Complication' : 'Miss'
  }
  if (outcome === ROLL_OUTCOME.STRONG) {
    key = match ? 'Opportunity' : 'StrongHit'
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

    this.roll.postRollOptions.replacedOutcome = {
      value: rollResult(momentum, c1, c2),
      source: game.i18n.localize('IRONSWORN.MomentumBurnt'),
    }
    return this.createOrUpdate()
  }

  async createOrUpdate() {
    await this.roll.evaluate()

    const renderData = {
      graphic: await renderRollGraphic(this.roll.preRollOptions, this.roll),
      ironswornroll: this.roll.serialize(),
      ...(await this.moveData()),
      ...this.momentumData(),
    }
    const content = await renderTemplate(
      'systems/foundry-ironsworn/templates/rolls/chat-message.hbs',
      renderData
    )

    if (this.roll.chatMessageId) {
      const msg = game.messages?.get(this.roll.chatMessageId)
      return msg?.update({ content })
    } else {
      const messageData = {
        speaker: ChatMessage.getSpeaker(),
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

  private async moveData(): Promise<any> {
    const move = await this.roll.moveItem
    if (move?.data.type !== 'sfmove') return {}

    // Original outcome
    const ret = {} as any
    const keys = {
      [ROLL_OUTCOME.MISS]: 'Miss',
      [ROLL_OUTCOME.WEAK]: 'Weak Hit',
      [ROLL_OUTCOME.STRONG]: 'Strong Hit',
    }
    if (this.roll.preAdjustmentOutcome) {
      const key = keys[this.roll.preAdjustmentOutcome.value]
      let dfOutcome = move.data.data.Outcomes?.[key] as IOutcomeInfo
      if (this.roll.isMatch && dfOutcome?.['With a Match']?.Text)
        dfOutcome = dfOutcome['With a Match']
      if (dfOutcome) {
        ret.originalMoveOutcome = dfOutcome.Text
      }
    }

    // Adjusted outcome
    if (this.roll.postAdjustmentOutcome) {
      const key = keys[this.roll.postAdjustmentOutcome.value]
      let dfOutcome = move.data.data.Outcomes?.[key] as IOutcomeInfo
      if (this.roll.isMatch && dfOutcome?.['With a Match']?.Text)
        dfOutcome = dfOutcome['With a Match']
      if (dfOutcome) {
        ret.adjustedMoveOutcome = dfOutcome.Text
      }
    }

    return ret
  }

  private momentumData(): any {
    if (this.actor?.data.type !== 'character') return {}

    const [c1, c2] = this.roll.finalChallengeDice ?? []
    if (c1 === undefined || c2 === undefined) return {}

    const momentum = this.actor.data.data.momentum
    const momentumOutcome = rollResult(momentum, c1, c2)

    switch (`${this.roll.preAdjustmentOutcome?.value} -> ${momentumOutcome}`) {
      case 'MISS -> WEAK':
      case 'MISS -> STRONG':
      case 'WEAK -> STRONG':
        return {
          possibleMomentumBurn: outcomeText(momentumOutcome, c1 === c2),
        }
      default:
        return {}
    }
  }
}
