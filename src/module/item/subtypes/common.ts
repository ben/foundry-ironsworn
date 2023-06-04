import type { TableResultDataConstructorData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/tableResultData'

export interface DelveSiteFeature
	extends DelveSiteFeatureOrDanger<'delve-site-feature'> {}

export interface DelveSiteDanger
	extends DelveSiteFeatureOrDanger<'delve-site-danger'> {}

export interface DelveSiteFeatureOrDanger<
	T extends 'delve-site-danger' | 'delve-site-feature' =
		| 'delve-site-danger'
		| 'delve-site-feature'
> extends TableResultDataConstructorData {
	flags: {
		'foundry-ironsworn': {
			type: T
			sourceId: string
		}
	}
}
