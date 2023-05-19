import { MeterField } from '../../fields/MeterField'
import type { IronswornActor } from '../actor'
import type { SchemaToSourceData } from '../../fields/utils'

export class SharedData extends foundry.abstract.DataModel<
	any,
	IronswornActor<'shared'>
> {
	static _enableV10Validation = true

	static override defineSchema() {
		return {
			biography: new foundry.data.fields.HTMLField(),
			supply: new MeterField({ label: 'IRONSWORN.Supply' })
		}
	}
}
export interface SharedData extends SchemaToSourceData<typeof SharedData> {}

export interface SharedDataSource {
	type: 'shared'
	/**
	 * @deprecated
	 */
	data: SharedData
	system: SharedData
}
export interface SharedDataProperties {
	type: 'shared'
	/**
	 * @deprecated
	 */
	data: InstanceType<typeof SharedData>
	system: InstanceType<typeof SharedData>
}
