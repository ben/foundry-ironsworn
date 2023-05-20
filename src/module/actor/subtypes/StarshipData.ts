import { MeterValueField } from '../../fields/MeterValueField'
import { ImpactField } from '../../fields/ImpactField'
import type { IronswornActor } from '../actor'
import type { SchemaToSourceData } from '../../fields/utils'

export class StarshipData extends foundry.abstract.DataModel<
	any,
	IronswornActor<'starship'>
> {
	static _enableV10Validation = true

	static override defineSchema() {
		return {
			health: new MeterValueField({ label: 'IRONSWORN.Integrity' }),
			debility: new foundry.data.fields.SchemaField({
				battered: new ImpactField(),
				cursed: new ImpactField()
			})
		}
	}
}
export interface StarshipData extends SchemaToSourceData<typeof StarshipData> {}

export interface StarshipDataSource {
	type: 'starship'
	/**
	 * @deprecated
	 */
	data: StarshipData
	system: StarshipData
}
export interface StarshipDataProperties {
	type: 'starship'
	/**
	 * @deprecated
	 */
	data: InstanceType<typeof StarshipData>
	system: InstanceType<typeof StarshipData>
}
