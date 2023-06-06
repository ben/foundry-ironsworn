import { DataforgedIDField } from '../../fields/DataforgedIDField'
import type { DataSchema } from '../../fields/utils'
import type { IronswornActor } from '../actor'

export class FoeData extends foundry.abstract.DataModel<
	FoeDataSourceData,
	IronswornActor<'foe'>
> {
	static _enableV10Validation = true

	static override defineSchema(): DataSchema<FoeDataSourceData> {
		return {
			dfid: new DataforgedIDField()
		}
	}
}
export interface FoeData extends FoeDataSourceData {}
export interface FoeDataSourceData {
	dfid: string | null
}

export interface FoeDataSource {
	type: 'foe'
	/**
	 * @deprecated
	 */
	data: FoeDataSourceData
	system: FoeDataSourceData
}
export interface FoeDataProperties {
	type: 'foe'
	/**
	 * @deprecated
	 */
	data: FoeData
	system: FoeData
}
