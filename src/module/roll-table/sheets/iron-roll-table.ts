import { hashLookup } from '../../dataforged'
import {
	findPathToNodeByTableUuid,
	getOracleTreeWithCustomOracles
} from '../../features/customoracles'
import { cachedDocumentsForPack } from '../../features/pack-cache'
import type { IronTableResult } from './iron-table-result'

export class IronRollTable extends RollTable {
	// TODO: remove the old getFoundryTableByDfId function in favour of this static method
	declare description: string
	static async fromDfId(
		dfid: string
	): Promise<StoredDocument<IronRollTable> | undefined> {
		const isd = await cachedDocumentsForPack(
			'foundry-ironsworn.ironswornoracles'
		)
		const sfd = await cachedDocumentsForPack(
			'foundry-ironsworn.starforgedoracles'
		)
		const matcher = (x) => x.id === hashLookup(dfid)
		return (isd?.find(matcher) ?? sfd?.find(matcher)) as
			| StoredDocument<IronRollTable>
			| undefined
	}

	async getDataforgedPath() {
		const starforgedRoot = await getOracleTreeWithCustomOracles('starforged')
		const ironswornRoot = await getOracleTreeWithCustomOracles('ironsworn')

		const pathElements =
			findPathToNodeByTableUuid(starforgedRoot, this.uuid) ??
			findPathToNodeByTableUuid(ironswornRoot, this.uuid)

		const pathNames = pathElements.map((x) => x.displayName)
		pathNames.shift() // root node has no display name
		pathNames.pop() // this is the one we rolled, it gets the main title

		return pathElements.map((x) => x.displayName).join(' / ')
	}

	override async toMessage(
		results: IronTableResult[],
		{
			roll = null,
			messageData = {},
			messageOptions = {}
		}: DeepPartial<RollTable.ToMessageOptions> = {}
	) {
		// options for this aren't exposed prior to running the method, so we have to rebuild them from scratch
		// these are loosely based on FVTT v10 RollTable#toMessage

		// TODO This is a fallback to handle tables that can produce multiple results from a single roll, which foundry-ironsworn doesn't presently use. There might be some utility to them doing so, however...
		if (results.length > 1)
			return await super.toMessage(results, {
				roll,
				messageData,
				messageOptions
			} as any)

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
				flags: { 'core.RollTable': this.id }
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
			subtitle: await this.getDataforgedPath(),
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
}
