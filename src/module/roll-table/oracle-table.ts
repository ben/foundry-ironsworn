import type { ChatSpeakerData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/chatSpeakerData'
import type { RollTableDataConstructorData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/rollTableData'
import type { IOracle, IRow } from 'dataforged'
import { max } from 'lodash-es'
import { marked } from 'marked'
import type { IronswornActor } from '../actor/actor'
import { hashLookup, renderLinksInStr } from '../dataforged'
import {
	findPathToNodeByTableUuid,
	getOracleTreeWithCustomOracles
} from '../features/customoracles'
import { cachedDocumentsForPack } from '../features/pack-cache'

import { OracleTableResult } from './oracle-table-result'
import type { ComputedTableType } from './roll-table-types'

declare global {
	interface ChatMessage {
		/** shim for v10; technically, ChatMessage#roll is deprecated, and it just gets ChatMessage#roll[0]. */
		rolls?: Roll[] | null | undefined
	}
}

/** Extends FVTT's default RollTable with functionality specific to this system. */
export class OracleTable extends RollTable {
	// missing from the LoFD types package
	declare description: string

	/** The custom template used for rendering oracle results */
	static resultTemplate =
		'systems/foundry-ironsworn/templates/rolls/oracle-roll-message.hbs'

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
		const matcher = (x: { id: string }) => x.id === hashLookup(dfid)
		return (isd?.find(matcher) ?? sfd?.find(matcher)) as
			| StoredDocument<OracleTable>
			| undefined
	}

	/** A string representing the path this table in the Ironsworn oracle tree (not including this table) */
	async getDfPath() {
		const starforgedRoot = await getOracleTreeWithCustomOracles('starforged')
		const ironswornRoot = await getOracleTreeWithCustomOracles('ironsworn')

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

	/** Transforms a Dataforged IOracle table into RollTable constructor data. */
	static fromDataforged(
		oracle: IOracle & { Table: IRow[] }
	): RollTableDataConstructorData {
		const description = marked.parseInline(
			renderLinksInStr(oracle.Description ?? '')
		)
		const maxRoll = max(oracle.Table.map((x) => x.Ceiling ?? 0)) // oracle.Table && maxBy(oracle.Table, (x) => x.Ceiling)?.Ceiling
		const data: RollTableDataConstructorData = {
			_id: hashLookup(oracle.$id),
			flags: {
				dfId: oracle.$id,
				category: oracle.Category
			},
			name: oracle.Name,
			description,
			formula: `d${maxRoll as number}`,
			replacement: true,
			displayRoll: true,
			/* folder: // would require using an additional module */
			results: oracle.Table?.filter((x) => x.Floor !== null).map((tableRow) =>
				OracleTableResult.fromDataforged(
					tableRow as IRow & { Floor: number; Ceiling: number }
				)
			)
		}
		return data
	}

	async _prepareTemplateData(results: OracleTableResult[], roll: null | Roll) {
		return {
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
			subtitle:
				this.getFlag('foundry-ironsworn', 'subtitle') ??
				(await this.getDfPath()),
			roll: roll?.toJSON(),
			table: this
		}
	}

	override async toMessage(
		results: OracleTableResult[],
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

		const templateData = await this._prepareTemplateData(results, roll)

		// Render the chat card which combines the dice roll with the drawn results
		messageData.content = await renderTemplate(
			OracleTable.resultTemplate,
			templateData
		)

		// Create the chat message
		return await cls.create(messageData, messageOptions)
	}

	/** Retrieve a computed oracle table from its originating document. This allows rehydration of computed tables from e.g. chat message flags. */
	static async getComputedTable(sourceUuid: string, type: ComputedTableType) {
		const source = await fromUuid(sourceUuid)
		if (source == null) return undefined
		let table: OracleTable | undefined
		switch (type) {
			case 'delve-site-dangers':
				table = await (source as IronswornActor).getDangers()
				break
			case 'delve-site-denizens':
				table = (source as IronswornActor).denizens
				break
			case 'delve-site-features':
				table = (source as IronswornActor).features
				break
			default:
				break
		}
		return table
	}

	/**
	 * Rerolls an oracle result message, replacing the message content with the new result
	 */
	static async reroll(messageId: string) {
		const msg = game.messages?.get(messageId)
		if (msg == null) return
		const oracleTableUuid = msg.getFlag('foundry-ironsworn', 'RollTable') as
			| string
			| undefined
		const rerolls = (msg.getFlag('foundry-ironsworn', 'rerolls') ??
			[]) as number[]

		const sourceUuid = msg.getFlag('foundry-ironsworn', 'sourceUuid') as
			| string
			| undefined
		const computedTableType = msg.getFlag('foundry-ironsworn', 'type') as
			| ComputedTableType
			| undefined

		if (
			oracleTableUuid == null &&
			(sourceUuid == null || computedTableType == null)
		)
			return
		let oracleTable: OracleTable | undefined
		if (oracleTableUuid != null)
			oracleTable = (await fromUuid(oracleTableUuid)) as OracleTable | undefined
		else
			oracleTable = await OracleTable.getComputedTable(
				sourceUuid as string,
				computedTableType as ComputedTableType
			)

		if (oracleTable == null) return
		// defer render to chat so we can manually set the chat message id
		const { results, roll } = await oracleTable.draw({ displayChat: false })

		const templateData = await oracleTable._prepareTemplateData(results, roll)

		const flags = foundry.utils.mergeObject(msg.toObject().flags, {
			'foundry-ironsworn': {
				rerolls: [...rerolls, roll.total]
			}
		})

		// module: Dice So Nice
		await game.dice3d?.showForRoll(roll, game.user, true)

		await msg.update({
			content: await renderTemplate(OracleTable.resultTemplate, templateData),
			flags
		})
	}
}

declare global {
	interface Game {
		// module: Dice So Nice

		dice3d?: {
			/**
			 * Show the 3D Dice animation for the Roll made by the User.
			 *
			 * @param roll - an instance of Roll class to show 3D dice animation.
			 * @param user - the user who made the roll (game.user by default).
			 * @param synchronize - if the animation needs to be shown to other players. Default: false
			 * @param whisper - list of users or userId who can see the roll, set it to null if everyone can see. Default: null
			 * @param blind - if the roll is blind for the current user. Default: false
			 * @param chatMessageID  -A chatMessage ID to reveal when the roll ends. Default: null
			 * @param speaker - An object using the same data schema than ChatSpeakerData. Needed to hide NPCs roll when the GM enables this setting.
			 * @returns {Promise<boolean>} when resolved true if the animation was displayed, false if not.
			 */
			showForRoll: (
				roll: Roll,
				user?: User | null,
				synchronize?: boolean,
				whisper?: Array<string | User>,
				blind?: boolean,
				chatMessageID?: string | null,
				speaker?: ChatSpeakerData
			) => Promise<boolean>
		}
	}
}
