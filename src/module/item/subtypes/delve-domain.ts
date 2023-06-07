import { TableResultField } from '../../fields/TableResultField'
import type { DataSchema } from '../../fields/utils'
import type { IronswornItem } from '../item'
import type { DelveSiteDanger, DelveSiteFeature } from './common'

export class DelveDomainData extends foundry.abstract.TypeDataModel<
	DelveDomainDataSourceData,
	IronswornItem<'delve-domain'>
> {
	static _enableV10Validation = true

	static readonly features: Array<Partial<DelveSiteFeature>> = [
		{ range: [21, 43] },
		{ range: [44, 56] },
		{ range: [57, 64] },
		{ range: [65, 68] },
		{ range: [69, 72] },
		{ range: [73, 76] },
		{ range: [77, 80] },
		{ range: [81, 84] },
		{ range: [85, 88] },
		{ range: [89, 98], text: 'Something unusual or unexpected' },
		{ range: [99, 99], text: 'You transition into a new theme' },
		{ range: [100, 100], text: 'You transition into a new domain' }
	]

	static readonly dangers: Array<Partial<DelveSiteDanger>> = [
		{ range: [31, 33] },
		{ range: [34, 36] },
		{ range: [37, 39] },
		{ range: [40, 42] },
		{ range: [43, 45] }
	]

	static override defineSchema(): DataSchema<DelveDomainDataSourceData> {
		const fields = foundry.data.fields
		return {
			summary: new fields.HTMLField(),
			description: new fields.HTMLField(),
			features: new fields.ArrayField(new TableResultField() as any, {
				initial: this.features as DelveSiteFeature[]
			}),
			dangers: new fields.ArrayField(new TableResultField() as any, {
				initial: this.dangers as DelveSiteDanger[]
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
