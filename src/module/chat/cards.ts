import { capitalize } from 'lodash'
import { moveDataByName } from '../helpers/data'
import { MoveContentCallbacks } from './movecontentcallbacks'
import { HIT_TYPE } from './chatrollhelpers'

export class IronswornChatCard {
  id?: string | null
  roll?: Roll | null

  constructor(message: ChatMessage, html: JQuery) {
    this.updateBinding(message, html)
  }

  get message(): ChatMessage | undefined {
    return game.messages?.get(this.id || '')
  }

  updateBinding(message: ChatMessage, html: JQuery) {
    // Do not store html here
    this.id = message.id
    this.roll = message.roll

    html.find('.burn-momentum').on('click', (ev) => this._burnMomentum.call(this, ev))
  }

  async _burnMomentum(ev: JQuery.ClickEvent) {
    ev.preventDefault()

    const { actor, move, stat, hittype } = ev.target.dataset

    const theActor = game.actors?.get(actor)
    theActor?.burnMomentum()

    let bonusContent: string | undefined
    let result: string | undefined
    if (move) {
      const theMove = await moveDataByName(move)
      result = theMove && theMove[capitalize(hittype.toLowerCase())]
      bonusContent = MoveContentCallbacks[move]?.call(this, hittype as HIT_TYPE, stat)
    }

    const parent = $(ev.currentTarget).parents('.message-content')
    parent.find('.roll-result').addClass('strikethru')
    parent.find('.roll-result button').prop('disabled', true)
    parent.find('.momentum-burn').html(`
      <h3>${game.i18n.localize('IRONSWORN.MomentumBurnt')}</h3>
      ${result}
      ${bonusContent || ''}
    `)

    const content = parent.html()
    await this.message?.update({ content })
  }

  static async bind(message: ChatMessage, html: JQuery) {
    const existing = message.ironswornCard
    if (existing) {
      existing.updateBinding(message, html)
    } else {
      message.ironswornCard = new IronswornChatCard(message, html)
    }
  }

  static registerHooks() {
    Hooks.on('renderChatMessage', IronswornChatCard.bind)
  }
}

// Extend type
declare global {
  interface ChatMessage {
    ironswornCard?: IronswornChatCard
  }
}
