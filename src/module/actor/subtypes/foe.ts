import { DataforgedIDField } from '../../fields/DataforgedIDField'
import type { IronswornActor } from '../actor'
import type { IronActorModel } from './common'

export class FoeModel
	extends foundry.abstract.TypeDataModel<
		FoeDataSourceData,
		FoeDataSourceData,
		IronswornActor<'foe'>
	>
	implements IronActorModel
{
	isValidImpact(statusEffect: StatusEffectV11): boolean {
		return false
	}

	static override defineSchema() {
		return {
			dfid: new DataforgedIDField()
		}
	}
}
export interface FoeModel extends FoeDataSourceData {}
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
	data: FoeModel
	system: FoeModel
}
