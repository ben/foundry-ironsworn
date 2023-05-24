import type { ChallengeRank } from 'dataforged'
import { ChallengeRankField } from '../../fields/ChallengeRankField'
import { ProgressTicksField } from '../../fields/ProgressTicksField'
import type { TableResultStub } from '../../fields/TableResultField'
import { TableResultField } from '../../fields/TableResultField'
import type { DataSchema } from '../../fields/utils'
import type { IronswornActor } from '../actor'

const denizenRanges: Array<[number, number]> = [
	[1, 27],
	[28, 41],
	[42, 55],
	[56, 69],
	[70, 75],
	[76, 81],
	[82, 87],
	[88, 93],
	[94, 95],
	[96, 97],
	[98, 99],
	[100, 100]
]

const denizenOptions: Array<Partial<TableResultField.Options>> =
	denizenRanges.map((staticRange) => ({ staticRange }))

export class SiteData extends foundry.abstract.DataModel<
	SiteDataSourceData,
	IronswornActor<'site'>
> {
	static _enableV10Validation = true

	protected override _configure(
		options?: foundry.data.fields.DataField.ValidateOptions
	) {
		super._configure(options)
		// brand denizens so that the originating delve site can be retrieved from message data
		for (const denizen of this._source.denizens) {
			setProperty(denizen, 'flags.foundry-ironsworn.sourceId', this.parent.id)
		}
	}

	get theme() {
		return this.parent.itemTypes['delve-theme'][0]
	}

	get domain() {
		return this.parent.itemTypes['delve-domain'][0]
	}

	get hasThemeAndDomain() {
		return this.theme != null && this.domain != null
	}

	static override defineSchema(): DataSchema<SiteDataSourceData> {
		const fields = foundry.data.fields
		return {
			rank: new ChallengeRankField(),
			current: new ProgressTicksField(),
			objective: new fields.HTMLField(),
			description: new fields.HTMLField(),
			notes: new fields.HTMLField(),
			denizens: new fields.ArrayField(new TableResultField(), {
				initial: denizenOptions.map((item) => new TableResultField(item)) as any
			})
		}
	}
}

export interface SiteData extends SiteDataSourceData {}

interface SiteDataSourceData {
	objective: string
	description: string
	notes: string
	rank: ChallengeRank
	current: number
	denizens: TableResultStub[]
}

export interface SiteDataSource {
	type: 'site'
	/**
	 * @deprecated
	 */
	data: SiteDataSourceData
	system: SiteDataSourceData
}
export interface SiteDataProperties {
	type: 'site'
	/**
	 * @deprecated
	 */
	data: SiteData
	system: SiteData
}
