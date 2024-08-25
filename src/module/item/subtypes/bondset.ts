import { getFoundryMoveByDfId } from '../../dataforged'
import { getFoundryMoveByDsId } from '../../datasworn2/finding'
import type { DataSchema } from '../../fields/utils'
import { IronswornPrerollDialog } from '../../rolls'
import type { IronswornItem } from '../item'

export class BondsetModel extends foundry.abstract.TypeDataModel<
	BondsetDataSourceData,
	BondsetDataSourceData,
	IronswornItem<'bondset'>
> {
	static _enableV10Validation = true

	async writeEpilogue() {
		const progress = Math.floor(this.bonds.length / 4)
		void IronswornPrerollDialog.showForOfficialMove(
			'move:classic/relationship/write_your_epilogue',
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
export interface BondsetModel extends BondsetDataSourceData {}

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
	data: BondsetModel
	system: BondsetModel
}
