import type { TableResultData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/module.mjs'
import type { OracleTable } from './oracle-table'

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
	get adjacentRows(): [this | undefined, this | undefined] {
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
	get displayRows(): [this | undefined, this, this | undefined] {
		const [prev, next] = this.adjacentRows
		return [prev, this, next]
	}

	// TODO: This might be a better way to manage summary text as a separate field in flags (distinct from the primary text)
	getChatText(): string {
		return super.getChatText()
	}
}
