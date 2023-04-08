import { compact } from 'lodash-es'
import { getDFMoveByDfId, getFoundryTableByDfId } from '../dataforged'
import type { IronswornItem } from '../item/item'
import type { SFMoveDataPropertiesData } from '../item/itemtypes'

export async function createSfMoveChatMessage(move: IronswornItem) {
	const { dfid, Oracles } = move.system as SFMoveDataPropertiesData
	const dfMove = await getDFMoveByDfId(dfid)
	const dfids = Oracles ?? dfMove?.Oracles ?? []
	const nextOracles = compact(
		await Promise.all(dfids.map(getFoundryTableByDfId))
	)

	const params = { move, nextOracles }
	const content = await renderTemplate(
		'systems/foundry-ironsworn/templates/chat/sf-move.hbs',
		params
	)
	await ChatMessage.create({
		speaker: ChatMessage.getSpeaker(),
		content
	})
}
