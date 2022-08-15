import { IronswornRoll } from '.'
import { renderRollGraphic } from './roll-graphic'

export class IronswornRollChatMessage {
  constructor(public roll: IronswornRoll) {}

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

  static async createOrUpdate(roll: IronswornRoll) {
    await roll.evaluate()

    const renderData = {
      ironswornroll: roll.serialize(),
      graphic: await renderRollGraphic(roll.preRollOptions, roll),
    }
    const content = await renderTemplate(
      'systems/foundry-ironsworn/templates/rolls/chat-message.hbs',
      renderData
    )

    if (roll.chatMessageId) {
      const msg = game.messages?.get(roll.chatMessageId)
      return msg?.update({ content })
    } else {
      const messageData = {
        speaker: ChatMessage.getSpeaker(),
        content,
        type: CONST.CHAT_MESSAGE_TYPES.ROLL,
        roll: roll.roll,
      }

      const cls = CONFIG.ChatMessage.documentClass
      const msg = await cls.create(messageData as any, {})
      roll.chatMessageId = msg?.id
      return msg
    }
  }
}
