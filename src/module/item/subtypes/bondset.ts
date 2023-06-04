import type { DataSchema } from '../../fields/utils'
import type { IronswornItem } from '../item'

export class BondsetData extends foundry.abstract.DataModel<
	BondsetDataSourceData,
	IronswornItem<'bondset'>
> {
	static _enableV10Validation = true

	static override defineSchema(): DataSchema<BondsetDataSourceData> {
		const fields = foundry.data.fields
		return {
			bonds: new fields.ArrayField(
				new fields.SchemaField<Bond>({
					name: new fields.StringField(),
					notes: new fields.HTMLField()
				})
			)
		}
	}
}
export interface BondsetData extends BondsetDataPropertiesData {}

export interface Bond {
	name: string
	notes: string
}

export interface BondsetDataSourceData {
	bonds: Bond[]
}
export interface BondsetDataPropertiesData extends BondsetDataSourceData {}

export interface BondsetDataSource {
	type: 'bondset'
	data: BondsetDataSourceData
	system: BondsetDataSourceData
}
export interface BondsetDataProperties {
	type: 'bondset'
	data: BondsetDataPropertiesData
	system: BondsetDataPropertiesData
}
