import { compact } from 'lodash'
import { getDFMoveByDfId, getFoundryTableByDfId } from '../dataforged'
import { IronswornItem } from '../item/item'
import { SFMoveDataPropertiesData } from '../item/itemtypes'

export async function createSfMoveChatMessage(move: IronswornItem) {
  const { dfid, Oracles } = move.system as SFMoveDataPropertiesData
  const dfMove = await getDFMoveByDfId(dfid)
  const dfIds = Oracles || dfMove?.Oracles || []
  const nextOracles = compact(
    await Promise.all(dfIds.map(getFoundryTableByDfId))
  )

  const params = { move, nextOracles }
  const content = await renderTemplate(
    'systems/foundry-ironsworn/templates/chat/sf-move.hbs',
    params
  )
  ChatMessage.create({
    speaker: ChatMessage.getSpeaker(),
    content,
  })
}
