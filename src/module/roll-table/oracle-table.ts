import type { RollTableDataConstructorData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/rollTableData'
import type { ConfiguredFlags } from '@league-of-foundry-developers/foundry-vtt-types/src/types/helperTypes'
import type { IOracle, IRow } from 'dataforged'
import { max, snakeCase } from 'lodash-es'
import { marked } from 'marked'
import type { IronswornActor } from '../actor/actor'
import { hashLookup, pickDataforged, renderLinksInStr } from '../dataforged'
import type { IronswornJournalEntry } from '../journal/journal-entry'
import type { IronswornJournalPage } from '../journal/journal-entry-page'

import { OracleTableResult } from './oracle-table-result'
import type { ComputedTableType, IOracleLeaf } from './roll-table-types'
import type { DataforgedNamespace } from './oracle-tree'
import { OracleTree } from './oracle-tree'
import type { IronFolder } from '../folder/folder'

/** Extends FVTT's default RollTable with functionality specific to this system. */
// @ts-expect-error
export class OracleTable extends RollTable {
	// missing from the LoFD types package

	/** Rolls on the table and returns the text of the first result. */
	async drawText(options: RollTable.DrawOptions = {}) {
		const {
			results: [result]
		} = await this.draw(options)
		return result.getChatText()
	}

	/** An array of the OracleTable's ancestor folders, if any. */
	get ancestors() {
		if (this.folder == null) return []
		return [...this.folder.ancestors, this.folder]
	}

	get canonical() {
		return Boolean(this.getFlag('foundry-ironsworn', 'canonical'))
	}

	get dfid() {
		return this.getFlag('foundry-ironsworn', 'dfid')
	}

	get dataforged() {
		return this.getFlag('foundry-ironsworn', 'dataforged')
	}

	get setting() {
		if (this.dfid == null) return undefined
		return this.dfid.split('/')[0] as DataforgedNamespace
	}

	static DEFAULT_ICON = 'icons/dice/d10black.svg'

	/** The custom template used for rendering oracle results */
	static resultTemplate =
		'systems/foundry-ironsworn/templates/rolls/oracle-roll-message.hbs'

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
			let oracleTable: OracleTable | undefined
			switch (true) {
				case /^(Ironsworn|Starforged)\/Oracles\//.test(id): // A Dataforged ID
					oracleTable = OracleTree.find(id)
					break
				case game.tables?.has(id): // A table ID
					oracleTable = game.tables?.get(id)
					break
				case /^(RollTable|Compendium)\./.test(id): // A UUID
					oracleTable = fromUuidSync(id) as OracleTable | undefined
					break
			}
			if (oracleTable instanceof OracleTable) {
				draws.push(await oracleTable.draw(options))
			} else {
				logger.warn(`Couldn't find an oracle for ID: ${id}`)
				continue
			}
		}
		return draws
	}

	/**
	 * @returns A "breadcrumb" string representing the path this table in the Ironsworn oracle tree (not including this table). */
	getDfPath() {
		if (this.dfid == null || this.ancestors.length === 0) return null
		return this.ancestors.map((ancestor) => ancestor.name).join(' / ')
	}

	/** Transforms a Dataforged IOracle table into RollTable constructor data. */
	static getConstructorData(
		oracle: OracleTable.IOracleLeaf
	): RollTableDataConstructorData {
		const description = marked.parseInline(
			renderLinksInStr(oracle.Description ?? '')
		)
		const maxRoll = max(oracle.Table.map((x) => x.Ceiling ?? 0))
		const flags: ConfiguredFlags<'RollTable'> = {
			'foundry-ironsworn': {
				dfid: oracle.$id,
				parentDfid: oracle['Member of'] ?? oracle.Category,
				dataforged: pickDataforged(
					oracle,
					'Source',
					'Display',
					'Usage',
					'Aliases'
				)
			}
		}

		// remove some redundant flags
		const flagsRemoved = ['Display.Title', 'Display.Table']
		flagsRemoved.forEach((flg) =>
			setProperty(flags, `foundry-ironsworn.dataforged.${flg}`, undefined)
		)

		let name = oracle.Display.Title

		// strip "Oracle XX: " from some ironsworn titles
		if (name.includes(':') && oracle.$id.startsWith('Ironsworn'))
			name = name.replace(/^.*?: /, '')

		let img: undefined | string
		if (oracle.Display.Icon)
			img = oracle.Display.Icon.replace(
				/^.*?\/Oracles\//,
				'systems/foundry-ironsworn/assets/oracles/'
			).toLowerCase()

		if (!img) {
			if (['Orbital', 'Planetside', 'Deep Space'].includes(name))
				img = `systems/foundry-ironsworn/assets/oracles/location/${snakeCase(
					name
				)}.svg`
		}

		const data: RollTableDataConstructorData = {
			_id: hashLookup(oracle.$id),
			name,
			img,
			sort: oracle.Source.Page,
			description,
			formula: `1d${maxRoll as number}`,
			replacement: true,
			displayRoll: true,
			results: oracle.Table?.filter((x) => x.Floor !== null).map((tableRow) =>
				OracleTableResult.getConstructorData(
					tableRow as IRow & { Floor: number; Ceiling: number }
				)
			),
			flags
		}
		return data
	}

	override toCompendium(
		...[pack, options]: Parameters<RollTable['toCompendium']>
	) {
		const data = super.toCompendium(pack, options)

		if (options == null) return data

		const canonicalPacks = Object.values(OracleTree.CANONICAL_PACKS).flat()

		// Patch: FVTT v10 doesn't properly clear the ownership flag when clearPermissions is set.
		if (options.clearOwnership ?? options.clearPermissions ?? false) {
			delete (data as any).ownership
		}
		if (canonicalPacks.includes(pack?.collection as any)) {
			setProperty(data, 'flags.foundry-ironsworn.canonical', undefined)
		}

		return data
	}

	/**
	 * Initialize one or more instances of OracleTable from a Dataforged {@link IOracle} node.
	 * @param options Default constructor options for the tables.
	 * @param context Default constructor context for the tables
	 */
	static async fromDataforged(
		tableData: OracleTable.IOracleLeaf,
		options?: Partial<RollTableDataConstructorData>,
		context?: DocumentModificationContext
	): Promise<OracleTable | undefined>
	static async fromDataforged(
		tableData: OracleTable.IOracleLeaf[],
		options?: Partial<RollTableDataConstructorData>,
		context?: DocumentModificationContext
	): Promise<OracleTable[]>
	static async fromDataforged(
		tableData: OracleTable.IOracleLeaf | OracleTable.IOracleLeaf[],
		options: Partial<RollTableDataConstructorData> = {},
		context: DocumentModificationContext = {}
	): Promise<OracleTable | OracleTable[] | undefined> {
		if (!Array.isArray(tableData)) {
			logger.info(`Building ${tableData.$id}`)
			return await OracleTable.create(
				mergeObject(OracleTable.getConstructorData(tableData) as any, options, {
					overwrite: false,
					inplace: false
				}) as RollTableDataConstructorData,
				context
			)
		}
		logger.info(`Building ${tableData.map((item) => item.$id).join(', ')}`)
		return await OracleTable.createDocuments(
			tableData.map(
				(table) =>
					mergeObject(OracleTable.getConstructorData(table) as any, options, {
						overwrite: false,
						inplace: false
					}) as RollTableDataConstructorData
			),
			context
		)
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
			result: mergeObject(
				result.toObject(false),
				{
					text: result.getChatText(),
					icon: result.icon,
					displayRows: result.displayRows.map((row) => row?.toObject())
				},
				{ inplace: false }
			),
			roll: roll?.toJSON(),
			table: this,
			subtitle:
				this.getFlag('foundry-ironsworn', 'subtitle') ?? this.getDfPath(),
			rollTableType: this.getFlag('foundry-ironsworn', 'type'),
			sourceId: this.getFlag('foundry-ironsworn', 'sourceId')
		}
	}

	/** Retrieve the originating document of a computed OracleTable.  */
	getSourceDocument() {
		const uuid = this.getFlag('foundry-ironsworn', 'sourceId')
		if (uuid == null) return undefined
		return fromUuidSync(uuid) as IronswornActor
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
			case 'delve-site-features': // delve site oracles are attributed to the delve site
				speakerOptions.actor = this.getSourceDocument()
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
			messageData,
			{ inplace: false }
		)

		// console.log('messageData', messageData)

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
	 * @param type The expected type of the computed table
	 */
	static async getComputedTable(sourceId: string, type: ComputedTableType) {
		const source = await fromUuid(sourceId)
		if (source == null) return undefined
		let table: OracleTable | undefined
		switch (type) {
			case 'delve-site-dangers':
				table = (source as IronswornActor).dangers
				break
			case 'delve-site-denizens':
				table = (source as IronswornActor).denizens
				break
			case 'delve-site-features':
				table = (source as IronswornActor).features
				break
			case 'truth-options':
				table = (source as IronswornJournalEntry).truthTable
				break
			case 'truth-option-subtable':
				table = (source as IronswornJournalPage).subtable
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

		const flags = foundry.utils.mergeObject(
			msg.toObject().flags,
			{
				'foundry-ironsworn': {
					rerolls: [...rerolls, roll.total]
				}
			},
			{ inplace: false }
		) as ConfiguredFlags<'ChatMessage'>

		// trigger sound + 3d dice manually because updating the message won't
		if (game.dice3d != null) void game.dice3d.showForRoll(roll, game.user, true)
		else void AudioHelper.play({ src: CONFIG.sounds.dice })

		return await msg.update({
			content: await renderTemplate(OracleTable.resultTemplate, templateData),
			flags
		})
	}
}

// @ts-expect-error
export interface OracleTable extends RollTable {
	get folder(): IronFolder<OracleTable> | null
}

export namespace OracleTable {
	export type IOracleLeaf = IOracle & { Table: IRow[] }
}
