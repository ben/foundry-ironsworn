import type { TableResultDataConstructorData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/tableResultData'
import { ChallengeRankField } from '../../fields/ChallengeRankField'
import { ProgressTicksField } from '../../fields/ProgressTicksField'
import type { IronswornActor } from '../actor'
import type { SchemaToSourceData } from '../../fields/utils'

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
			denizens: new fields.ArrayField(
				new fields.EmbeddedDataField(
					// @ts-expect-error
					foundry.documents.BaseTableResult
				)
			)
		}
	}
}
export interface SiteData extends SchemaToSourceData<typeof SiteData> {
	denizens: DelveSiteDenizen[]
}

/**
 * Represents an entry in the delve site denizen matrix.
 */
export interface DelveSiteDenizen extends TableResultDataConstructorData {}

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
