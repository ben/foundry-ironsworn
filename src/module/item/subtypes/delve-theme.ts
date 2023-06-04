import { TableResultField } from '../../fields/TableResultField'
import type { DataSchema } from '../../fields/utils'
import type { IronswornItem } from '../item'
import type { DelveSiteDanger, DelveSiteFeature } from './common'

const themeFeatures = [
	[1, 4],
	[5, 8],
	[9, 12],
	[13, 16],
	[17, 20]
]
const themeDangers = [
	[1, 5],
	[6, 10],
	[11, 12],
	[13, 14],
	[15, 16],
	[17, 18],
	[19, 20],
	[21, 22],
	[23, 24],
	[25, 26],
	[27, 28],
	[29, 30]
]

export class DelveThemeData extends foundry.abstract.DataModel<
	DelveThemeDataSourceData,
	IronswornItem<'delve-theme'>
> {
	static _enableV10Validation = true

	static override defineSchema(): DataSchema<DelveThemeDataSourceData> {
		const fields = foundry.data.fields
		return {
			summary: new fields.HTMLField(),
			description: new fields.HTMLField(),
			features: new fields.ArrayField(new TableResultField() as any, {
				initial: themeFeatures.map((row) => ({
					range: row,
					flags: { 'foundry-ironsworn': { type: 'delve-site-feature' } }
				})) as DelveSiteFeature[]
			}),
			dangers: new fields.ArrayField(new TableResultField() as any, {
				initial: themeDangers.map((row) => ({
					range: row,
					flags: { 'foundry-ironsworn': { type: 'delve-site-danger' } }
				})) as DelveSiteDanger[]
			})
		}
	}
}
export interface DelveThemeData extends DelveThemeDataPropertiesData {}

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
	data: DelveThemeDataPropertiesData
	system: DelveThemeDataPropertiesData
}
