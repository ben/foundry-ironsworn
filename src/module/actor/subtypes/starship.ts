import { ImpactField } from '../../fields/ImpactField'
import type { IronswornActor } from '../actor'
import type { DataSchema } from '../../fields/utils'

export class StarshipModel extends foundry.abstract.TypeDataModel<
	StarshipDataSourceData,
	StarshipDataSourceData,
	IronswornActor<'starship'>
> {
	static _enableV10Validation = true

	static override defineSchema(): DataSchema<StarshipDataSourceData> {
		return {
			// @ts-expect-error
			debility: new foundry.data.fields.SchemaField<
				StarshipDataSourceData['debility']
			>({
				battered: new ImpactField(),
				cursed: new ImpactField()
			})
		}
	}
}
export interface StarshipModel extends StarshipDataSourceData {}

interface StarshipDataSourceData {
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
	data: StarshipModel
	system: StarshipModel
}
