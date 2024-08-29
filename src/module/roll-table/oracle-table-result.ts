import type { TableResultDataConstructorData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/tableResultData'
import type { DFIRow } from '../item/types'
import { inRange } from 'lodash-es'
import { hashLookup } from '../helpers/util'

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
	static getConstructorData(
		tableRow: DFIRow & { Floor: number; Ceiling: number; dfid?: string }
	): TableResultDataConstructorData {
		let text: string
		if (tableRow.Result && tableRow.Summary) {
			text = `${tableRow.Result} (${tableRow.Summary})`
		} else text = tableRow.Result ?? ''

		const data: TableResultDataConstructorData = {
			range: [tableRow.Floor, tableRow.Ceiling],
			text: tableRow.Result
		}

		const _id =
			tableRow.dfid ??
			(tableRow as any).system?.dfid ??
			(tableRow as any).flags?.['foundry-ironsworn']?.dfid ??
			tableRow.$id

		if (_id != null) data._id = hashLookup(_id)

		return data
	}
}
