import type { ConditionMeterSource } from '../../fields/MeterField'
import { ConditionMeterField } from '../../fields/MeterField'
import type { DataSchema } from '../../fields/utils'
import type { IronswornActor } from '../actor'
import type { IronActorModel } from './common'

export class SharedData
	extends foundry.abstract.TypeDataModel<
		SharedDataSourceData,
		IronswornActor<'shared'>
	>
	implements IronActorModel
{
	static _enableV10Validation = true

	isValidImpact(status: StatusEffectV11) {
		return false
	}

	static override defineSchema(): DataSchema<SharedDataSourceData> {
		return {
			biography: new foundry.data.fields.HTMLField(),
			supply: new ConditionMeterField({ label: 'IRONSWORN.Supply' })
		}
	}
}
export interface SharedData extends SharedDataSourceData {}

interface SharedDataSourceData {
	biography: string
	supply: ConditionMeterSource
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
