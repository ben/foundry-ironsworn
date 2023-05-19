import type { IronswornActor } from '../actor'
import type { SchemaToSourceData } from '../../fields/utils'

export class FoeData extends foundry.abstract.DataModel<
	any,
	IronswornActor<'foe'>
> {
	static _enableV10Validation = true

	static override defineSchema() {
		return {}
	}
}
export interface FoeData extends SchemaToSourceData<typeof FoeData> {}

export interface FoeDataSource {
	type: 'foe'
	/**
	 * @deprecated
	 */
	data: FoeData
	system: FoeData
}
export interface FoeDataProperties {
	type: 'foe'
	/**
	 * @deprecated
	 */
	data: InstanceType<typeof FoeData>
	system: InstanceType<typeof FoeData>
}
