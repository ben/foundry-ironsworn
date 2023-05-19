import type { IronswornActor } from '../actor'
import type { SchemaToSourceData } from '../../fields/utils'

export class LocationData extends foundry.abstract.DataModel<
	any,
	IronswornActor<'location'>
> {
	static _enableV10Validation = true

	static override defineSchema() {
		const fields = foundry.data.fields
		return {
			subtype: new fields.StringField(),
			klass: new fields.StringField(),
			description: new fields.HTMLField()
		}
	}
}
export interface LocationData extends SchemaToSourceData<typeof LocationData> {}

export interface LocationDataSource {
	type: 'location'
	/**
	 * @deprecated
	 */
	data: LocationData
	system: LocationData
}
export interface LocationDataProperties {
	type: 'location'
	/**
	 * @deprecated
	 */
	data: InstanceType<typeof LocationData>
	system: InstanceType<typeof LocationData>
}
