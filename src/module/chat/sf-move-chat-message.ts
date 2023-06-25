import { compact } from 'lodash-es'
import { getDFMoveByDfId } from '../dataforged'
import type { IronswornItem } from '../item/item'
import { Oracles } from '../roll-table/oracles'

export async function createSfMoveChatMessage(move: IronswornItem<'sfmove'>) {
	const dfMove = await getDFMoveByDfId(move.system.dfid)
	const dfids = move.system.Oracles ?? dfMove?.Oracles ?? []
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
