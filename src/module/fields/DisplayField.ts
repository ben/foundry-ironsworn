import type { IDisplay } from 'dataforged'

export class DisplayField extends foundry.data.fields.SchemaField<Display> {
	constructor() {
		const fields = foundry.data.fields
		super({
			// @ts-expect-error
			Color: new fields.ColorField({ required: false, nullable: true }),
			// @ts-expect-error
			Images: new fields.ArrayField<string[]>(
				new fields.FilePathField({ categories: ['IMAGE'] })
			)
		})
	}
}

export interface Display extends Omit<IDisplay, 'Icon'> {}
