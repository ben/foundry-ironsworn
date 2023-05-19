import type {
	TableResultDataConstructorData,
	TableResultDataSchema
} from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/tableResultData'
import { ChallengeRankField } from '../../fields/ChallengeRankField'
import { ProgressTicksField } from '../../fields/ProgressTicksField'
import type { IronswornActor } from '../actor'
import type { SchemaToSourceData } from '../../fields/utils'
import { OracleTableResult } from '../../roll-table/oracle-table-result'
import SchemaField from '../../fields/types/SchemaField'
import { clone, omit } from 'lodash-es'

export class StaticOracleResult extends foundry.data.fields.SchemaField<any> {
	constructor(options?) {
		const fields = clone(
			foundry.documents.BaseTableResult.defineSchema() as Record<
				string,
				foundry.data.fields.DataField.Any
			>
		)
		// fields.range.initial = range
		fields.range.readonly = true
		for (const [k, v] of Object.entries(fields)) {
			v.required = false
		}

		super(fields, options)
	}
}

export class SiteData extends foundry.abstract.DataModel<
	any,
	IronswornActor<'site'>
> {
	static _enableV10Validation = true

	protected override _initialize(...args) {
		super._initialize(...args)
		// brand denizens so that the originating delve site can be retrieved from message data
		for (const denizen of this.denizens) {
			setProperty(denizen, 'flags.foundry-ironsworn.sourceId', this.parent.id)
		}
	}

	static override defineSchema() {
		const fields = foundry.data.fields
		return {
			rank: new ChallengeRankField(),
			current: new ProgressTicksField(),
			objective: new fields.HTMLField(),
			description: new fields.HTMLField(),
			notes: new fields.HTMLField(),
			denizens: new fields.ArrayField(new StaticOracleResult(), {
				initial: [
					{
						range: [1, 27],
						text: '',
						flags: {
							'foundry-ironsworn': { type: 'delve-site-denizen' }
						}
					},
					{
						range: [28, 41],
						text: '',
						flags: {
							'foundry-ironsworn': { type: 'delve-site-denizen' }
						}
					},
					{
						range: [42, 55],
						text: '',
						flags: {
							'foundry-ironsworn': { type: 'delve-site-denizen' }
						}
					},
					{
						range: [56, 69],
						text: '',
						flags: {
							'foundry-ironsworn': { type: 'delve-site-denizen' }
						}
					},
					{
						range: [70, 75],
						text: '',
						flags: {
							'foundry-ironsworn': { type: 'delve-site-denizen' }
						}
					},
					{
						range: [76, 81],
						text: '',
						flags: {
							'foundry-ironsworn': { type: 'delve-site-denizen' }
						}
					},
					{
						range: [82, 87],
						text: '',
						flags: {
							'foundry-ironsworn': { type: 'delve-site-denizen' }
						}
					},
					{
						range: [88, 93],
						text: '',
						flags: {
							'foundry-ironsworn': { type: 'delve-site-denizen' }
						}
					},
					{
						range: [94, 95],
						text: '',
						flags: {
							'foundry-ironsworn': { type: 'delve-site-denizen' }
						}
					},
					{
						range: [96, 97],
						text: '',
						flags: {
							'foundry-ironsworn': { type: 'delve-site-denizen' }
						}
					},
					{
						range: [98, 99],
						text: '',
						flags: {
							'foundry-ironsworn': { type: 'delve-site-denizen' }
						}
					},
					{
						range: [100, 100],
						text: '',
						flags: {
							'foundry-ironsworn': { type: 'delve-site-denizen' }
						}
					}
				].map((item) => new OracleTableResult(item as any))
			})
		}
	}
}

export interface SiteData extends SchemaToSourceData<typeof SiteData> {
	denizens: StaticOracleResult[]
}

/**
 * Represents an entry in the delve site denizen matrix.
 */
export interface StaticOracleResult extends TableResultDataConstructorData {}

export interface SiteDataSource {
	type: 'site'
	/**
	 * @deprecated
	 */
	data: SiteData
	system: SiteData
}
export interface SiteDataProperties {
	type: 'site'
	/**
	 * @deprecated
	 */
	data: InstanceType<typeof SiteData>
	system: InstanceType<typeof SiteData>
}
