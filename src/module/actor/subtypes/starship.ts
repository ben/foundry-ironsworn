import type { IronswornActor } from '../actor'
import type { DataSchema } from '../../fields/utils'
import type { IronActorModel } from './common'

export class StarshipData
	extends foundry.abstract.TypeDataModel<
		StarshipDataSourceData,
		IronswornActor<'starship'>
	>
	implements IronActorModel
{
	static _enableV10Validation = true

	isValidImpact(statusEffect: StatusEffectV11): boolean {
		return (
			statusEffect.flags?.['foundry-ironsworn']?.type === 'impact' &&
			statusEffect.flags?.['foundry-ironsworn']?.category === 'vehicle'
		)
	}

	static override defineSchema(): DataSchema<StarshipDataSourceData> {
		return {}
	}
}
export interface StarshipData extends StarshipDataSourceData {}

interface StarshipDataSourceData {}
export interface StarshipDataSource {
	type: 'starship'
	/**
	 * @deprecated
	 */
	data: StarshipDataSourceData
	system: StarshipDataSourceData
}
export interface StarshipDataProperties {
	type: 'starship'
	/**
	 * @deprecated
	 */
	data: StarshipData
	system: StarshipData
}
