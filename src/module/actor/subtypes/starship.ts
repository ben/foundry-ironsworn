import type { IronswornActor } from '../actor'
import type { DataSchema } from '../../fields/utils'
import { IronActorModel } from './common'

export class StarshipData
	extends foundry.abstract.TypeDataModel<
		StarshipDataSourceData,
		IronswornActor<'starship'>
	>
	implements IronActorModel
{
	static _enableV10Validation = true

	get tokenStatusEffects(): IronActorModel['tokenStatusEffects'] {
		return []
	}

	/** Status effects toggles shown on tokens of this subtype **/
	// get tokenStatusEffects() {
	// 	return CONFIG.IRONSWORN.IronActiveEffect.STATUS_EFFECTS[
	// 		this.parent.impactSet
	// 	].filter(
	// 		(status) =>
	// 			status.flags?.['foundry-ironsworn']?.category === 'vehicle' &&
	// 			status.flags?.['foundry-ironsworn'].ruleset === this.parent.impactSet
	// 	)
	// }

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
