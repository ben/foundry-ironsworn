import type { ISettingTruthOption } from 'dataforged'
import { DfidField } from '../../fields/DfidField'
import type { DataSchema } from '../../fields/utils'
import type { IronswornJournalPage } from '../journal-entry-page'

export class TruthModel extends foundry.abstract.TypeDataModel<
	TruthOptionDataSourceData,
	TruthOptionDataPropertiesData,
	IronswornJournalPage<'truth'> & foundry.abstract.Document<any, any, any>
> {
	static override defineSchema(): DataSchema<TruthOptionDataPropertiesData> {
		const fields = foundry.data.fields
		return {
			dfid: new DfidField('truth'),
			Floor: new fields.NumberField({ integer: true }),
			Ceiling: new fields.NumberField({ integer: true }),
			Summary: new fields.HTMLField(),
			Description: new fields.HTMLField(),
			Quest: new fields.HTMLField(),
			Subtable: new fields.ArrayField(
				new fields.SchemaField({
					Floor: new fields.NumberField({ integer: true }),
					Ceiling: new fields.NumberField({ integer: true }),
					Result: new fields.HTMLField()
				})
			)
		}
	}
}

export interface TruthOptionDataSourceData
	extends Pick<
		ISettingTruthOption,
		'Ceiling' | 'Floor' | 'Subtable' | 'Description' | 'Summary'
	> {
	dfid: string
	Quest: string
}
export interface TruthOptionDataPropertiesData
	extends TruthOptionDataSourceData {}
export interface TruthOptionDataSource {
	system: TruthOptionDataSourceData
	type: 'truth'
}
export interface TruthOptionDataProperties {
	system: TruthOptionDataPropertiesData
	type: 'truth'
}
