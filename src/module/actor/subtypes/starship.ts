import { MeterValueField } from '../../fields/MeterValueField'
import { ImpactField } from '../../fields/ImpactField'
import type { IronswornActor } from '../actor'
import type { DataSchema } from '../../fields/utils'

export class StarshipData extends foundry.abstract.TypeDataModel<
	StarshipDataSourceData,
	IronswornActor<'starship'>
> {
	static _enableV10Validation = true

	/** Impact status IDs permitted for starships */
	static readonly IMPACTS = ['battered', 'cursed']

	static override defineSchema(): DataSchema<StarshipDataSourceData> {
		return {
			health: new MeterValueField({ label: 'IRONSWORN.Integrity' })
		}
	}
}
export interface StarshipData extends StarshipDataSourceData {}

interface StarshipDataSourceData {
	health: number
}
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
