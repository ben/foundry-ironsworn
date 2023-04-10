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

import { OracleTableResult } from './oracle-table-result'
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
}
