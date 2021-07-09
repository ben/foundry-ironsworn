import { EnhancedDataswornMove } from "../helpers/data"

export class IronswornChatCard {
  id?: string | null
  roll?: Roll | null
  move?: EnhancedDataswornMove

  constructor(message: ChatMessage, html: JQuery) {
    this.updateBinding(message, html)
  }

  updateBinding(message: ChatMessage, html: JQuery) {
    // Do not store html here
    this.id = message.id
    this.roll = message.roll
    this.move = message.move

    html.find('.burn-momentum').on('click', ev => this._burnMomentum.call(this, ev))
  }

  _burnMomentum(ev: JQuery.ClickEvent) {
    ev.preventDefault()
    console.log(this);
  }

  static async bind(message: ChatMessage, html: JQuery) {
    console.log({message, html});

    const existing = message.ironswornCard
    if (existing) {
      existing.updateBinding(message, html)
    } else {
      message.ironswornCard = new IronswornChatCard(message, html)
    }
  }

  static registerHooks() {
    Hooks.on("renderChatMessage", IronswornChatCard.bind)
  }
}


// Extend type
declare global {
  interface ChatMessage {
    ironswornCard?: IronswornChatCard
  }
}
