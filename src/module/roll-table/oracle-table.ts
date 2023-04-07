import { hashLookup } from '../dataforged'
import {
	findPathToNodeByTableUuid,
	getOracleTreeWithCustomOracles
} from '../features/customoracles'
import { cachedDocumentsForPack } from '../features/pack-cache'

import { IronTableResult as OracleTableResult } from './oracle-table-result'

interface OracleTableDraw extends RollTableDraw {
	roll: Roll
	results: OracleTableResult[]
}

export class OracleTable extends RollTable {
	// missing from the LoFD types package
	declare description: string
	declare draw: (
		options?: RollTable.DrawOptions | undefined
	) => Promise<OracleTableDraw>

	// TODO: remove the old getFoundryTableByDfId function in favour of this static method
	static async getByDfId(
		dfid: string
	): Promise<StoredDocument<OracleTable> | undefined> {
		const isd = await cachedDocumentsForPack(
			'foundry-ironsworn.ironswornoracles'
		)
		const sfd = await cachedDocumentsForPack(
			'foundry-ironsworn.starforgedoracles'
		)
		const matcher = (x) => x.id === hashLookup(dfid)
		return (isd?.find(matcher) ?? sfd?.find(matcher)) as
			| StoredDocument<OracleTable>
			| undefined
	}

	/** A string representing the path this table in the Ironsworn oracle tree (not including this table) */
	async getDfPath() {
		const starforgedRoot = await getOracleTreeWithCustomOracles('starforged')
		const ironswornRoot = await getOracleTreeWithCustomOracles('ironsworn')
		console.log(starforgedRoot, ironswornRoot)

		const pathElements =
			findPathToNodeByTableUuid(starforgedRoot, this.uuid) ??
			findPathToNodeByTableUuid(ironswornRoot, this.uuid)

		const pathNames = pathElements.map((x) => x.displayName)
		// root node (0) has no display name
		pathNames.shift()
		// last node  is *this* node
		pathNames.pop()

		return pathNames.join(' / ')
	}

	override async toMessage(
		results: TableResult[],
		{
			roll = null,
			messageData = {},
			messageOptions = {}
		}: DeepPartial<RollTable.ToMessageOptions> = {}
	) {
		// options for this aren't exposed prior to running the method, so we have to rebuild them from scratch
		// these are loosely based on FVTT v10 RollTable#toMessage

		// TODO This is a fallback to handle tables that can produce multiple results from a single roll, which foundry-ironsworn doesn't presently use. There might be some utility to them doing so, however...
		if (
			results.length > 1 ||
			results.some((result) => !(result instanceof OracleTableResult))
		)
			return await super.toMessage(results, {
				roll,
				messageData,
				// @ts-expect-error
				messageOptions
			})

		const cls = getDocumentClass('ChatMessage')

		const speaker = cls.getSpeaker()

		// Construct chat data
		messageData = foundry.utils.mergeObject(
			{
				user: game.user?.id,
				speaker,
				type:
					roll != null
						? CONST.CHAT_MESSAGE_TYPES.ROLL
						: CONST.CHAT_MESSAGE_TYPES.OTHER,
				roll,
				sound: roll != null ? CONFIG.sounds.dice : null,
				flags: {
					'core.RollTable': this.id,
					'foundry-ironsworn.RollTable': this.uuid
				}
			},
			messageData
		)

		const templateData = {
			// NB: with these options, this is async in v10
			// eslint-disable-next-line @typescript-eslint/await-thenable
			description: await TextEditor.enrichHTML(this.description, {
				documents: true,
				// @ts-expect-error exists in v10
				async: true
			}),
			results: results.map((result) => {
				const r = result.toObject(false)
				r.text = result.getChatText()
				// @ts-expect-error exists in v10
				r.icon = result.icon
				// @ts-expect-error
				r.displayRows = result.displayRows
				return r
			}),
			subtitle: await this.getDfPath(),
			roll: roll?.toJSON(),
			table: this
		}

		// Render the chat card which combines the dice roll with the drawn results
		messageData.content = await renderTemplate(
			'systems/foundry-ironsworn/templates/rolls/oracle-roll-message.hbs',
			templateData
		)

		// Create the chat message
		return await cls.create(messageData, messageOptions)
	}

	/** Rerolls an oracle result message, replacing it with the new result */
	static async reroll(messageId: string) {
		const msg = game.messages?.get(messageId)
		const rollTableUuid = msg?.getFlag('foundry-ironsworn', 'RollTable') as
			| string
			| undefined
		if (rollTableUuid == null) return
		const rollTable = (await fromUuid(rollTableUuid)) as RollTable | undefined

		// defer render to chat so we can manually set the chat message id
		const draw = await rollTable?.draw({ displayChat: false })

		if (draw == null) return
		const { results, roll } = draw

		await rollTable?.toMessage(results, {
			roll,
			messageData: { _id: messageId }
		})
	}
}
