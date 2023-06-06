import { MeterValueField } from '../../fields/MeterValueField'
import { ImpactField } from '../../fields/ImpactField'
import type { IronswornActor } from '../actor'
import type { DataSchema } from '../../fields/utils'

export class StarshipData extends foundry.abstract.DataModel<
	StarshipDataSourceData,
	IronswornActor<'starship'>
> {
	static _enableV10Validation = true

	static override defineSchema(): DataSchema<StarshipDataSourceData> {
		return {
			health: new MeterValueField({ label: 'IRONSWORN.Integrity' }),
			debility: new foundry.data.fields.SchemaField<
				StarshipDataSourceData['debility']
			>({
				battered: new ImpactField(),
				cursed: new ImpactField()
			})
		}
	}
}
export interface StarshipData extends StarshipDataSourceData {}

interface StarshipDataSourceData {
	health: number
	debility: {
		battered: boolean
		cursed: boolean
	}
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
