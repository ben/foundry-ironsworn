import { IronActiveEffect } from '../../active-effect/active-effect'
import type { ConditionMeterSource } from '../../fields/MeterField'
import { ConditionMeterField } from '../../fields/MeterField'
import type { DataSchema } from '../../fields/utils'
import type { IronswornActor } from '../actor'

export class SharedData extends foundry.abstract.TypeDataModel<
	SharedDataSourceData,
	IronswornActor<'shared'>
> {
	static _enableV10Validation = true

	/** Status effects toggles shown on tokens of this subtype **/
	get tokenStatusEffects(): (typeof CONFIG)['statusEffects'] {
		return IronActiveEffect.STATUS_EFFECTS[this.parent.impactSet].filter(
			(status) =>
				status.flags?.['foundry-ironsworn']?.type === 'impact' &&
				status.flags?.['foundry-ironsworn']?.global &&
				status.flags?.['foundry-ironsworn'].ruleset === this.parent.impactSet
		)
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
