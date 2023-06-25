import type { IronswornActor } from '../actor'
import type { DataSchema } from '../../fields/utils'
import type { IronActorModel } from './common'

export class StarshipModel
	extends foundry.abstract.TypeDataModel<
		StarshipDataSourceData,
		StarshipDataSourceData,
		IronswornActor<'starship'>
	>
	implements IronActorModel
{
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
export interface StarshipModel extends StarshipDataSourceData {}

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
	data: StarshipModel
	system: StarshipModel
}
