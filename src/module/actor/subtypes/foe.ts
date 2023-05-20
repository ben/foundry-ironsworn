import type { IronswornActor } from '../actor'

export class FoeData extends foundry.abstract.DataModel<
	FoeDataSourceData,
	IronswornActor<'foe'>
> {
	static _enableV10Validation = true

	static override defineSchema() {
		return {}
	}
}
export interface FoeData extends FoeDataSourceData {}
export interface FoeDataSourceData {}

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
