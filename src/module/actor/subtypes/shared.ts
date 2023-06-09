import { MeterValueField } from '../../fields/MeterValueField'
import type { DataSchema } from '../../fields/utils'
import type { IronswornActor } from '../actor'

export class SharedData extends foundry.abstract.TypeDataModel<
	SharedDataSourceData,
	IronswornActor<'shared'>
> {
	static _enableV10Validation = true

	static override defineSchema(): DataSchema<SharedDataSourceData> {
		return {
			biography: new foundry.data.fields.HTMLField(),
			supply: new MeterValueField({ label: 'IRONSWORN.Supply' })
		}
	}
}
export interface SharedData extends SharedDataSourceData {}

interface SharedDataSourceData {
	biography: string
	supply: number
}

export interface SharedDataSource {
	type: 'shared'
	/**
	 * @deprecated
	 */
	data: SharedDataSourceData
	system: SharedDataSourceData
}
export interface SharedDataProperties {
	type: 'shared'
	/**
	 * @deprecated
	 */
	data: SharedData
	system: SharedData
}
