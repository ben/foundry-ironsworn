import type { TableResultDataConstructorData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/tableResultData'
import type { IRow } from 'dataforged'
import { inRange } from 'lodash-es'
import { hashLookup, renderLinksInStr } from '../dataforged'

/** Extends FVTT's default TableResult with functionality specific to this system. */
export class OracleTableResult extends TableResult {
	/** Does the number value fall within the range of this TableResult? */
	hasInRange(value: number) {
		const [low, high] = this.range
		return inRange(value, low, high + 1)
	}

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
		throw new Error('NYI')
		// let text: string
		// if (tableRow.Result && tableRow.Summary) {
		// 	text = `${tableRow.Result} (${tableRow.Summary})`
		// } else text = tableRow.Result ?? ''

		// const data: TableResultDataConstructorData = {
		// 	_id: hashLookup(tableRow.$id ?? ''),
		// 	range: [tableRow.Floor, tableRow.Ceiling],
		// 	text: tableRow.Result && renderLinksInStr(text)
		// }

		// return data
	}
}
