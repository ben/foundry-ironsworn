import { getFoundryMoveByDfId } from '../../dataforged'
import type { DataSchema } from '../../fields/utils'
import { IronswornPrerollDialog } from '../../rolls'
import type { IronswornItem } from '../item'

export class BondsetData extends foundry.abstract.TypeDataModel<
	BondsetDataSourceData,
	BondsetDataSourceData,
	IronswornItem<'bondset'>
> {
	static _enableV10Validation = true

	async writeEpilogue() {
		const move = await getFoundryMoveByDfId(
			'Ironsworn/Moves/Relationship/Write_Your_Epilogue'
		)
		if (move == null) throw new Error('Problem loading write-epilogue move')

		const progress = Math.floor(this.bonds.length / 4)
		void IronswornPrerollDialog.showForOfficialMove(
			'Ironsworn/Moves/Relationship/Write_Your_Epilogue',
			{
				actor: this.parent.actor ?? undefined,
				progress: {
					source: game.i18n.localize('IRONSWORN.ITEMS.TypeBond'),
					value: progress
				}
			}
		)
	}

	static override defineSchema(): DataSchema<BondsetDataSourceData> {
		const fields = foundry.data.fields
		return {
			bonds: new fields.ArrayField(
				new fields.SchemaField<Bond>({
					name: new fields.StringField(),
					notes: new fields.HTMLField()
				})
			)
		}
	}
}
export interface BondsetData extends BondsetDataSourceData {}

export interface Bond {
	name: string
	notes: string
}

export interface BondsetDataSourceData {
	bonds: Bond[]
}
export interface BondsetDataSource {
	type: 'bondset'
	data: BondsetDataSourceData
	system: BondsetDataSourceData
}
export interface BondsetDataProperties {
	type: 'bondset'
	data: BondsetData
	system: BondsetData
}
