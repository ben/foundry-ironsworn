import type { TableResultDataConstructorData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/tableResultData'
import type { IRow, RequireKey } from 'dataforged'
import { inRange, snakeCase } from 'lodash-es'
import { hashLookup, pickDataforged, renderLinksInStr } from '../dataforged'

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
		row: OracleTableResult.IRollableRow
	): TableResultDataConstructorData {
		let text: string
		if (row.Result && row.Summary) {
			text = `${row.Result} (${row.Summary})`
		} else text = row.Result ?? ''

		let img: undefined | string
		if (row.Display?.Icon)
			img = row.Display.Icon.replace(
				/^.*?\/Oracles\//,
				'systems/foundry-ironsworn/assets/oracles/'
			).toLowerCase()
		if (!img) {
			const attrs = Object.fromEntries(
				(row.Attributes ?? []).map((attr) => Object.values(attr))
			)

			if (attrs.Location)
				img = `systems/foundry-ironsworn/assets/oracles/location/${snakeCase(
					attrs.Location
				)}.svg`
			if (attrs['Location Theme'])
				img = `systems/foundry-ironsworn/assets/oracles/location_theme/${snakeCase(
					attrs['Location Theme']
				)}.svg`
			if (attrs.Environment)
				img = `systems/foundry-ironsworn/assets/oracles/creature/environment/${snakeCase(
					attrs.Environment
				)}.svg`
		}

		const data: TableResultDataConstructorData = {
			range: [row.Floor, row.Ceiling],
			text: row.Result && renderLinksInStr(text),
			img,
			flags: {
				'foundry-ironsworn': pickDataforged(
					row,
					'$id',
					'Attributes',
					'Suggestions',
					'Oracle rolls',
					'Game objects'
				)
			}
		}

		const rawId =
			row.dfid ??
			(row as any).system?.dfid ??
			(row as any).flags?.['foundry-ironsworn']?.dfid ??
			row.$id

		if (rawId != null) data._id = hashLookup(rawId)

		return data
	}

	/** Does the row data have a numeric range? */
	static isRollableRow(row: IRow): row is OracleTableResult.IRollableRow {
		return typeof row.Floor === 'number' && typeof row.Ceiling === 'number'
	}

	static isEmbeddedRow(row: IRow): row is OracleTableResult.IEmbeddedRow {
		return typeof (row as OracleTableResult.IEmbeddedRow)?.dfid === 'string'
	}

	/**
	 * Initialize one or more instances of OracleTable from Dataforged's data.
	 * @param options Default constructor options for the tables.
	 * @param context Default constructor context for the tables
	 */
	static async fromDataforged(
		rowData: OracleTableResult.IRollableRow,
		options?: Partial<TableResultDataConstructorData>,
		context?: DocumentModificationContext
	): Promise<OracleTableResult | undefined>
	static async fromDataforged(
		rowData: OracleTableResult.IRollableRow[],
		options?: Partial<TableResultDataConstructorData>,
		context?: DocumentModificationContext
	): Promise<OracleTableResult[]>
	static async fromDataforged(
		rowData: OracleTableResult.IRollableRow | OracleTableResult.IRollableRow[],
		options: Partial<TableResultDataConstructorData> = {},
		context: DocumentModificationContext = {}
	): Promise<OracleTableResult | OracleTableResult[] | undefined> {
		if (!Array.isArray(rowData)) {
			return await OracleTableResult.create(
				mergeObject(
					options,
					OracleTableResult.getConstructorData(rowData)
				) as TableResultDataConstructorData,
				context
			)
		}
		return await OracleTableResult.createDocuments(
			rowData.map(
				(row) =>
					mergeObject(
						options,
						OracleTableResult.getConstructorData(row)
					) as TableResultDataConstructorData
			),
			context
		)
	}
}

export namespace OracleTableResult {
	export type IEmbeddedRow = IRow & { dfid: string }
	export type IRollableRow = RequireKey<IRow, 'Floor' | 'Ceiling'> & {
		dfid?: string
	}
}
