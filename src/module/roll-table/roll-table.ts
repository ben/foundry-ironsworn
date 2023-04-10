import type { RollTableDataConstructorData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/rollTableData'
import type { ConfiguredFlags } from '@league-of-foundry-developers/foundry-vtt-types/src/types/helperTypes'
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

import { OracleTableResult } from './table-result'
import type { ComputedTableType } from './roll-table-types'

/** Extends FVTT's default RollTable with functionality specific to this system. */
export class OracleTable extends RollTable {
	// missing from the LoFD types package
	declare description: string

	static DEFAULT_ICON = 'icons/dice/d10black.svg'

	/** The custom template used for rendering oracle results */
	static resultTemplate =
		'systems/foundry-ironsworn/templates/rolls/oracle-roll-message.hbs'

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

	/**
	 * "Ask the Oracle": Retrieve one or more oracle tables and immediately rolls on them.
	 *
	 * @param ids A table ID, a table UUID, or Dataforged ID. Alternatively, an array of IDs may be provided, and each will be rolled.
	 * @param options Options to configure the `RollTable#draw` method.
	 * @see https://foundryvtt.com/api/classes/client.RollTable.html#draw
	 */
	static async ask(ids: string | string[], options?: RollTable.DrawOptions) {
		if (typeof ids === 'string') ids = [ids]
		const draws: RollTableDraw[] = []

		for await (const id of ids) {
			let tbl: OracleTable | undefined
			switch (true) {
				case /^(ironsworn|starforged)\/oracles/i.test(id):
					// A Dataforged ID
					tbl = await OracleTable.getByDfId(id)
					break
				case /^(RollTable|Compendium)\./.test(id):
					// A UUID
					tbl = (await fromUuid(id)) as OracleTable | undefined
					break
				case game.tables?.has(id):
					// check world tables
					tbl = game.tables?.get(id)
					break
				default:
					{
						// fall back to oracle packs
						const sfPack = game.packs.get('foundry-ironsworn.starforgedoracles')
						const isPack = game.packs.get('foundry-ironsworn.ironswornoracles')
						tbl = ((await sfPack?.getDocument(id)) ??
							(await isPack?.getDocument(id))) as OracleTable | undefined
					}
					break
			}
			if (tbl == null) {
				logger.warn(`Couldn't find an oracle for ID: ${id}`)
				continue
			} else {
				const result = await tbl.draw(options)
				draws.push(result)
			}
		}
		return draws
	}

	/**
	 * @returns a string representing the path this table in the Ironsworn oracle tree (not including this table) */
	async getDfPath() {
		const starforgedRoot = await getOracleTreeWithCustomOracles('starforged')
		const ironswornRoot = await getOracleTreeWithCustomOracles('ironsworn')

		const pathElements =
			findPathToNodeByTableUuid(starforgedRoot, this.uuid) ??
			findPathToNodeByTableUuid(ironswornRoot, this.uuid)

		const pathNames = pathElements.map((x) => x.displayName)
		// root node (0) has no display name
		pathNames.shift()
		// last node is *this* node
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
				'foundry-ironsworn': { dfid: oracle.$id, category: oracle.Category }
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

	/**
	 * Prepares handlebars template data for an oracle roll message.
	 * @remarks This is provided as its own method so that it can be reused to 'fake' rerolls in OracleTable#reroll
	 */
	async _prepareTemplateData(results: OracleTableResult[], roll: null | Roll) {
		const result = results[0]
		return {
			// NB: with these options, this is async in v10
			// eslint-disable-next-line @typescript-eslint/await-thenable
			description: await TextEditor.enrichHTML(this.description, {
				documents: true,
				// @ts-expect-error exists in v10
				async: true
			}),
			result: mergeObject(result.toObject(false), {
				text: result.getChatText(),
				icon: result.icon,
				displayRows: result.displayRows.map((row) => row?.toObject())
			}),
			roll: roll?.toJSON(),
			table: this,
			subtitle:
				this.getFlag('foundry-ironsworn', 'subtitle') ??
				(await this.getDfPath()),
			rollTableType: this.getFlag('foundry-ironsworn', 'type'),
			sourceId: this.getFlag('foundry-ironsworn', 'sourceId')
		}
	}

	/** Retrieve the originating document of a computed OracleTable.  */
	async getSourceDocument() {
		const uuid = this.getFlag('foundry-ironsworn', 'sourceId')
		if (uuid == null) return undefined
		return (await fromUuid(uuid)) as IronswornActor
	}

	override async toMessage(
		results: OracleTableResult[],
		{
			roll = null,
			messageData = {},
			messageOptions = {}
		}: DeepPartial<RollTable.ToMessageOptions> = {}
	) {
		const cls = getDocumentClass('ChatMessage')
		const rollTableType = this.getFlag('foundry-ironsworn', 'type')

		const speakerOptions: ChatMessage.GetSpeakerOptions = {}

		// intentionally left as a switch for later expansion
		switch (rollTableType) {
			case 'delve-site-dangers':
			case 'delve-site-denizens':
			case 'delve-site-features': // delve site oracles are attributed
				speakerOptions.actor = await this.getSourceDocument()
				break
			default:
				break
		}

		const speaker = cls.getSpeaker(speakerOptions)

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

		const flags: ConfiguredFlags<'ChatMessage'> = {
			core: { RollTable: this.id },
			'foundry-ironsworn': {
				rollTableType: this.getFlag('foundry-ironsworn', 'type'),
				sourceId: this.getFlag('foundry-ironsworn', 'sourceId') ?? this.uuid
			}
		}

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
				flags
			},
			messageData
		)

		console.log('messageData', messageData)

		const templateData = await this._prepareTemplateData(results, roll)

		// Render the chat card which combines the dice roll with the drawn results
		messageData.content = await renderTemplate(
			OracleTable.resultTemplate,
			templateData
		)

		// Create the chat message
		return await cls.create(messageData, messageOptions)
	}

	/**
	 * Retrieve a computed oracle table from its originating document. This allows rehydration of computed tables from e.g. chat message flags.
	 * @param sourceId The UUID of the original source of the computed table, usually an Actor or Item.
	 */
	static async getComputedTable(sourceId: string, type: ComputedTableType) {
		const source = await fromUuid(sourceId)
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
			// TODO
			case 'truth-options':
			case 'truth-option-subtable':
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

		const rerolls = msg.getFlag('foundry-ironsworn', 'rerolls') ?? []
		const sourceId = msg.getFlag('foundry-ironsworn', 'sourceId')
		const rollTableType = msg.getFlag('foundry-ironsworn', 'rollTableType')

		// console.log(rerolls, sourceId, rollTableType)

		if (sourceId == null) return
		let oracleTable: OracleTable | undefined
		if (rollTableType == null)
			oracleTable = (await fromUuid(sourceId)) as OracleTable | undefined
		else {
			oracleTable = await OracleTable.getComputedTable(sourceId, rollTableType)
		}
		if (oracleTable == null) return

		// defer render to chat so we can manually set the chat message id
		const { results, roll } = await oracleTable.draw({ displayChat: false })

		const templateData = await oracleTable._prepareTemplateData(results, roll)

		const flags = foundry.utils.mergeObject(msg.toObject().flags, {
			'foundry-ironsworn': {
				rerolls: [...rerolls, roll.total]
			}
		}) as ConfiguredFlags<'ChatMessage'>

		// trigger sound + 3d dice manually because updating the message won't
		void AudioHelper.play({ src: CONFIG.sounds.dice })
		void game.dice3d?.showForRoll(roll, game.user, true)

		return await msg.update({
			content: await renderTemplate(OracleTable.resultTemplate, templateData),
			flags
		})
	}
}
