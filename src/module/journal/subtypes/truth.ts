import type { TableResultDataConstructorData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/tableResultData'
import type { IRow, ISettingTruthOption } from 'dataforged'
import { DataforgedIDField } from '../../fields/DataforgedIDField'
import type { DataSchema } from '../../fields/utils'
import { OracleTable } from '../../roll-table/oracle-table'
import { OracleTableResult } from '../../roll-table/oracle-table-result'
import type { IronswornJournalPage } from '../journal-entry-page'

export class TruthModel extends foundry.abstract.TypeDataModel<
	TruthOptionDataSourceData,
	TruthOptionDataPropertiesData,
	IronswornJournalPage<'truth'> & foundry.abstract.Document<any, any, any>
> {
	static override defineSchema(): DataSchema<
		TruthOptionDataSourceData,
		TruthOptionDataPropertiesData
	> {
		const fields = foundry.data.fields
		return {
			dfid: new DataforgedIDField(),
			Floor: new fields.NumberField({ integer: true }),
			Ceiling: new fields.NumberField({ integer: true }),
			Summary: new fields.HTMLField(),
			Description: new fields.HTMLField(),
			Quest: new fields.HTMLField(),
			Result: new fields.HTMLField(),
			Subtable: new fields.ArrayField(
				new fields.SchemaField({
					Floor: new fields.NumberField({ integer: true }),
					Ceiling: new fields.NumberField({ integer: true }),
					Result: new fields.HTMLField()
				})
			)
		}
	}

	get subtable() {
		if (this.Subtable?.length == null) return undefined
		return new OracleTable({
			name: this.parent.name ?? '???',
			formula: '1d100',
			results: this.Subtable.map((row) =>
				OracleTableResult.getConstructorData(
					row as IRow & { Floor: number; Ceiling: number }
				)
			),
			flags: {
				'foundry-ironsworn': {
					subtitle: game.i18n.localize('IRONSWORN.First Start.SettingTruths'),
					sourceId: this.parent.uuid,
					type: 'truth-option-subtable'
				}
			}
		})
	}

	toTruthTableResultData() {
		const data: TableResultDataConstructorData = {
			range: [this.Floor ?? 0, this.Ceiling ?? 100],
			text: this.Result,
			flags: {
				'foundry-ironsworn': {
					sourceId: this.parent.uuid,
					type: 'truth-option'
				}
			}
		}
		return data
	}
}
export interface TruthModel extends TruthOptionDataPropertiesData {}

export interface TruthOptionDataPropertiesData
	extends TruthOptionDataSourceData {}

export interface TruthOptionDataSourceData
	extends Pick<
		ISettingTruthOption,
		'Ceiling' | 'Floor' | 'Subtable' | 'Description' | 'Summary' | 'Result'
	> {
	dfid: string
	Quest: string
}
export interface TruthOptionDataSource {
	system: TruthOptionDataSourceData
	type: 'truth'
}
export interface TruthOptionDataProperties {
	system: TruthModel
	type: 'truth'
}
