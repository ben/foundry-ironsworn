import type { ISource } from 'dataforged'

export class SourceField extends foundry.data.fields.SchemaField<ISource> {
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
