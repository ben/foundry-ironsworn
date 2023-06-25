import type { TableResultDataConstructorData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/tableResultData'
import type { LegacyTableRow } from '../roll-table/roll-table-types'

export type TableResultStub = Omit<
	TableResultDataConstructorData,
	'weight' | '_id' | 'collection' | 'resultId' | 'drawn'
>

/** A field containing TableResult constructor data, used to generic dynamic RollTables like those used for delve site denizens, features, and dangers. */
export class TableResultField extends foundry.data.fields
	.SchemaField<TableResultStub> {
	constructor(options?: Partial<TableResultField.Options>) {
		const fields = foundry.data.fields
		// based on BaseTableResult#defineSchema
		super({
			type: new fields.NumberField({
				choices: Object.values(CONST.TABLE_RESULT_TYPES) as any,
				initial: CONST.TABLE_RESULT_TYPES.TEXT,
				validationError: 'must be a value in CONST.TABLE_RESULT_TYPES'
			}),
			text: new fields.HTMLField({ required: false }),
			img: new fields.FilePathField({ categories: ['IMAGE'] }),

			range: new fields.ArrayField(new fields.NumberField({ integer: true }), {
				initial: options?.staticRange ?? undefined,
				readonly: Boolean(options?.staticRange),
				required: Boolean(options?.staticRange),
				validate: (range: [number, number]) =>
					range.length === 2 && range[1] >= range[0],
				validationError: 'must be a length-2 array of ascending integers'
			}),
			// the typings infer this more strictly, but internally, this is consistent with every other flag field
			flags: new fields.ObjectField({ required: false }) as any
		})
	}

	migrateSource(
		sourceData: unknown,
		fieldData: TableResultDataConstructorData
	) {
		if (hasProperty(sourceData as object, 'low')) {
			const legacyRowData = sourceData as LegacyTableRow
			fieldData.range = [legacyRowData.low, legacyRowData.high]
			fieldData.text = legacyRowData.text ?? legacyRowData.description
		}
		return fieldData
	}
}
export interface TableResultField
	extends foundry.data.fields.SchemaField<TableResultStub> {}
export namespace TableResultField {
	export interface Options
		extends foundry.data.fields.DataField.Options<TableResultStub> {
		/** Set a readonly `range` for this table result */
		staticRange: [number, number]
	}
}
