import { compact } from 'lodash-es'
import { getDFMoveByDfId } from '../dataforged'
import type { IronswornItem } from '../item/item'
import type { SFMoveDataPropertiesData } from '../item/config'
import { OracleTable } from '../roll-table/oracle-table'

export async function createSfMoveChatMessage(move: IronswornItem) {
	const { dfid, Oracles } = move.system as SFMoveDataPropertiesData
	const dfMove = await getDFMoveByDfId(dfid)
	const dfids = Oracles ?? dfMove?.Oracles ?? []
	const nextOracles = compact(
		await Promise.all(dfids.map(OracleTable.getByDfId))
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
