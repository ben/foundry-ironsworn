// this file is basically deprecated. use rolls/chat-message.ts instead
import { IronswornActor } from '../actor/actor'
import { DenizenSlot } from '../actor/actortypes'

interface DenizenChatInput {
  roll: Roll
  site: IronswornActor
  denizen: DenizenSlot
}

export async function createIronswornDenizenChat(params: DenizenChatInput) {
  const content = await renderTemplate(
    'systems/foundry-ironsworn/templates/chat/denizen.hbs',
    params
  )
  ChatMessage.create({
    speaker: ChatMessage.getSpeaker(),
    content,
    type: CONST.CHAT_MESSAGE_TYPES.ROLL,
    roll: params.roll,
  } as any)
}
