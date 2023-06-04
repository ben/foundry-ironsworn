import { TableResultField } from '../../fields/TableResultField'
import type { DataSchema } from '../../fields/utils'
import type { IronswornItem } from '../item'
import type { DelveSiteDanger, DelveSiteFeature } from './common'

const domainFeatures = [
	[21, 43],
	[44, 56],
	[57, 64],
	[65, 68],
	[69, 72],
	[73, 76],
	[77, 80],
	[81, 84],
	[85, 88],
	[89, 98],
	[99, 99],
	[100, 100]
]
const domainDangers = [
	[31, 33],
	[34, 36],
	[37, 39],
	[40, 42],
	[43, 45]
]

export class DelveDomainData extends foundry.abstract.DataModel<
	DelveDomainDataSourceData,
	IronswornItem<'delve-domain'>
> {
	static _enableV10Validation = true

	static override defineSchema(): DataSchema<DelveDomainDataSourceData> {
		const fields = foundry.data.fields
		return {
			summary: new fields.HTMLField(),
			description: new fields.HTMLField(),
			features: new fields.ArrayField(new TableResultField() as any, {
				initial: domainFeatures.map((row) => ({
					range: row,
					flags: { 'foundry-ironsworn': { type: 'delve-site-feature' } }
				})) as DelveSiteFeature[]
			}),
			dangers: new fields.ArrayField(new TableResultField() as any, {
				initial: domainDangers.map((row) => ({
					range: row,
					flags: { 'foundry-ironsworn': { type: 'delve-site-danger' } }
				})) as DelveSiteDanger[]
			})
		}
	}
}
export interface DelveDomainData extends DelveDomainDataPropertiesData {}

export interface DelveDomainDataSourceData {
	summary: string
	description: string
	features: DelveSiteFeature[]
	dangers: DelveSiteDanger[]
}
export interface DelveDomainDataPropertiesData
	extends DelveDomainDataSourceData {}

export interface DelveDomainDataSource {
	type: 'delve-domain'
	data: DelveDomainDataSourceData
	system: DelveDomainDataSourceData
}
export interface DelveDomainDataProperties {
	type: 'delve-domain'
	data: DelveDomainDataPropertiesData
	system: DelveDomainDataPropertiesData
}
