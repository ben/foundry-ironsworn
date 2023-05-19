import type { TableResultDataConstructorData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/tableResultData'
import type { DataSchema } from './types/DataModel'

/** A field containing TableResult constructor data, used to generic dynamic RollTables like those used for delve site denizens, features, and dangers. */
export class TableResultField extends foundry.data.fields.SchemaField<
	DataSchema<TableResultDataConstructorData>
> {
	constructor(options?: Partial<TableResultField.Options>) {
		const fields = foundry.data.fields
		// based on BaseTableResult#defineSchema
		super({
			// _id: new fields.DocumentIdField({ required: false }),
			type: new fields.NumberField({
				choices: Object.values(CONST.TABLE_RESULT_TYPES),
				initial: CONST.TABLE_RESULT_TYPES.TEXT,
				validationError: 'must be a value in CONST.TABLE_RESULT_TYPES'
			}),
			text: new fields.HTMLField(),
			img: new fields.FilePathField({ categories: ['IMAGE'] }),
			// documentCollection: new fields.StringField(),
			// documentId: new fields.ForeignDocumentField(Document, { idOnly: true }),
			// weight: new fields.NumberField({
			// 	integer: true,
			// 	positive: true,
			// 	required: false
			// }),
			range: new fields.ArrayField(new fields.NumberField({ integer: true }), {
				initial: options?.staticRange ?? undefined,
				readonly: Boolean(options?.staticRange),
				required: Boolean(options?.staticRange),
				validate: (range: [number, number]) =>
					range.length === 2 && range[1] >= range[0],
				validationError: 'must be a length-2 array of ascending integers'
			}),
			// drawn: new fields.BooleanField(),
			flags: new fields.ObjectField()
		})
	}
}
export namespace TableResultField {
	export interface Options
		extends foundry.data.fields.DataField
			.Options<TableResultDataConstructorData> {
		/** Set a readonly `range` for this table result */
		staticRange: [number, number]
	}
}
