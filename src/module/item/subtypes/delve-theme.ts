import { TableResultField } from '../../fields/TableResultField'
import type { DataSchema } from '../../fields/utils'
import type { IronswornItem } from '../item'
import type { DelveSiteDanger, DelveSiteFeature } from './common'

export class DelveThemeModel extends foundry.abstract.TypeDataModel<
	DelveThemeDataSourceData,
	DelveThemeDataSourceData,
	IronswornItem<'delve-theme'>
> {
	static _enableV10Validation = true

	static readonly features: Array<Partial<DelveSiteFeature>> = [
		{ range: [1, 4] },
		{ range: [5, 8] },
		{ range: [9, 12] },
		{ range: [13, 16] },
		{ range: [17, 20] }
	]

	static readonly dangers: Array<Partial<DelveSiteDanger>> = [
		{ range: [1, 5] },
		{ range: [6, 10] },
		{ range: [11, 12] },
		{ range: [13, 14] },
		{ range: [15, 16] },
		{ range: [17, 18] },
		{ range: [19, 20] },
		{ range: [21, 22] },
		{ range: [23, 24] },
		{ range: [25, 26] },
		{ range: [27, 28] },
		{ range: [29, 30] }
	]

	static override defineSchema(): DataSchema<DelveThemeDataSourceData> {
		const fields = foundry.data.fields
		return {
			summary: new fields.HTMLField(),
			description: new fields.HTMLField(),
			features: new fields.ArrayField(new TableResultField() as any, {
				initial: DelveThemeModel.features as DelveSiteFeature[]
			}),
			dangers: new fields.ArrayField(new TableResultField() as any, {
				initial: DelveThemeModel.dangers as DelveSiteDanger[]
			})
		}
	}
}
export interface DelveThemeModel extends DelveThemeDataPropertiesData {}

export interface DelveThemeDataSourceData {
	summary: string
	description: string
	features: DelveSiteFeature[]
	dangers: DelveSiteDanger[]
}

export interface DelveThemeDataPropertiesData
	extends DelveThemeDataSourceData {}

export interface DelveThemeDataSource {
	type: 'delve-theme'
	data: DelveThemeDataSourceData
	system: DelveThemeDataSourceData
}
export interface DelveThemeDataProperties {
	type: 'delve-theme'
	data: DelveThemeModel
	system: DelveThemeModel
}
