import { EnhancedDataswornMove } from '../helpers/data'

export class IronswornChatCard {
  id?: string | null
  roll?: Roll | null
  move?: EnhancedDataswornMove

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
    this.move = message.move

    html.find('.burn-momentum').on('click', (ev) => this._burnMomentum.call(this, ev))
  }

  async _burnMomentum(ev: JQuery.ClickEvent) {
    ev.preventDefault()

    const { actor, result } = ev.target.dataset
    const theActor = game.actors?.get(actor)
    theActor?.burnMomentum()

    const parent = $(ev.currentTarget).parents('.message-content')
    parent.find('.roll-result').addClass('strikethru')
    parent.find('.momentum-burn').html(`<h4>${game.i18n.localize('IRONSWORN.MomentumBurnt')}</h4>\n${result}`)

    const content = parent.html()
    await this.message?.update({ content })
  }

  static async bind(message: ChatMessage, html: JQuery) {
    console.log({ message, html })

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
