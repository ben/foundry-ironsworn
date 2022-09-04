import { IronswornItem } from '../item/item'
import { sfNextOracles } from './chatrollhelpers'

export async function createSfMoveChatMessage(move: IronswornItem) {
  const params = {
    move,
    nextOracles: await sfNextOracles(move),
  }
  const content = await renderTemplate(
    'systems/foundry-ironsworn/templates/chat/sf-move.hbs',
    params
  )
  ChatMessage.create({
    speaker: ChatMessage.getSpeaker(),
    content,
  })
}
