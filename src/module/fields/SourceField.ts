import type { DFISource } from '../item/types'

export class SourceField extends foundry.data.fields.SchemaField<DFISource> {
	constructor() {
		const fields = foundry.data.fields

		super({
			Authors: new fields.ArrayField(new fields.StringField()),
			Date: new fields.StringField(),
			Page: new fields.NumberField({ integer: true, min: 0 }),
			Title: new fields.StringField(),
			Url: new fields.StringField()
		})
	}
}
