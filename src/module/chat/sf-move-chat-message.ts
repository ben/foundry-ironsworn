import { compact } from 'lodash-es'
import type { IronswornItem } from '../item/item'
import { OracleTable } from '../roll-table/oracle-table'
import { IronswornHandlebarsHelpers } from '../helpers/handlebars'

export async function createSfMoveChatMessage(move: IronswornItem<'sfmove'>) {
	const { dsOracleIds } = move.system

	const nextOracles = compact(
		await Promise.all(dsOracleIds.map((x) => OracleTable.getByDsId(x)))
	)

	const renderedText = await IronswornHandlebarsHelpers.enrichMarkdown(
		move.system.Text
	)

	const params = { move, nextOracles, renderedText }
	const content = await renderTemplate(
		'systems/foundry-ironsworn/templates/chat/sf-move.hbs',
		params
	)
	await ChatMessage.create({
		speaker: ChatMessage.getSpeaker(),
		content
	})
}
