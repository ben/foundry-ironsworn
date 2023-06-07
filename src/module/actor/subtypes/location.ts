import type { DataSchema } from '../../fields/utils'
import type { IronswornActor } from '../actor'

export class LocationData extends foundry.abstract.TypeDataModel<
	LocationDataSourceData,
	IronswornActor<'location'>
> {
	static _enableV10Validation = true

	static override defineSchema(): DataSchema<LocationDataSourceData> {
		const fields = foundry.data.fields
		return {
			subtype: new fields.StringField(),
			klass: new fields.StringField(),
			description: new fields.HTMLField()
		}
	}
}
export interface LocationData extends LocationDataSourceData {}

interface LocationDataSourceData {
	subtype: string
	klass: string
	description: string
}

export interface LocationDataSource {
	type: 'location'
	/**
	 * @deprecated
	 */
	data: LocationDataSourceData
	system: LocationDataSourceData
}
export interface LocationDataProperties {
	type: 'location'
	/**
	 * @deprecated
	 */
	data: LocationData
	system: LocationData
}
