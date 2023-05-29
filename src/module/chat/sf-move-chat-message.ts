import { compact } from 'lodash-es'
import { getDFMoveByDfId } from '../dataforged'
import type { IronswornItem } from '../item/item'
import type { SFMoveDataPropertiesData } from '../item/itemtypes'
import { Oracles } from '../roll-table/oracles'

export async function createSfMoveChatMessage(move: IronswornItem) {
	const { dfid, Oracles: oracles } = move.system as SFMoveDataPropertiesData
	const dfMove = await getDFMoveByDfId(dfid)
	const dfids = oracles ?? dfMove?.Oracles ?? []
	const nextOracles = compact(await Promise.all(dfids.map(Oracles.find)))

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
