import type { TableResultDataConstructorData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/tableResultData'
import type { TableResultData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/module.mjs'
import type { IRow } from 'dataforged'
import { hashLookup, renderLinksInStr } from '../dataforged'
import type { OracleTable } from './oracle-table'

declare global {
	interface FlagConfig {
		TableResult: {
			'foundry-ironsworn'?: {
				/** The UUID of the originating document */
				sourceUuid?: Actor['uuid'] | Item['uuid'] | null | undefined
				type?: ComputedTableResultType
			}
		}
	}
}

export type ComputedTableResultType =
	| 'delve-site-denizen'
	| 'delve-site-feature'
	| 'delve-site-danger'
	| 'truth-option'
	| 'truth-option-subtable-result'

/** Extends FVTT's default TableResult with functionality specific to this system. */
export class OracleTableResult extends TableResult {
	declare parent: OracleTable

	// in a universe that made sense i would not have to declare these, yet here we are
	declare range: TableResultData['range']
	declare text: TableResultData['text']
	declare type: TableResultData['type']
	declare img: TableResultData['img']

	/**
	 * Returns the table rows immediately above and below this row.
	 * @return A tuple of the previous row (if it exists) and the next row (if it exists).
	 * @remarks Doesn't take into account overlapping ranges because 1) it's complicated and 2) none of our tables utilize that (currently).
	 */
	get adjacentRows(): [
		OracleTableResult | undefined,
		OracleTableResult | undefined
	] {
		const prev = this.collection.find(
			(result) => result.range[1] === this.range[0] - 1
		)
		const next = this.collection.find(
			(result) => result.range[0] === this.range[1] + 1
		)
		return [prev, next]
	}

	/**
	 * Convenience getter that returns the adjacent rows *plus* this row in an ordered tuple.
	 * @return A ordered tuple containing the previous result, the current result, and the next result,
	 */
	get displayRows(): [
		OracleTableResult | undefined,
		this,
		OracleTableResult | undefined
	] {
		const [prev, next] = this.adjacentRows
		return [prev, this, next]
	}

	// TODO: TableResult#getChatText might be a better way to manage summary text as a separate field in flags (distinct from the primary text)

	/** Converts a Dataforged IRow object into OracleTableResult constructor data. */
	static fromDataforged(
		tableRow: IRow & { Floor: number; Ceiling: number }
	): TableResultDataConstructorData {
		let text: string
		if (tableRow.Result && tableRow.Summary) {
			text = `${tableRow.Result} (${tableRow.Summary})`
		} else text = tableRow.Result ?? ''

		const data: TableResultDataConstructorData = {
			_id: hashLookup(tableRow.$id ?? ''),
			range: [tableRow.Floor, tableRow.Ceiling],
			text: tableRow.Result && renderLinksInStr(text)
		}

		return data
	}
}
