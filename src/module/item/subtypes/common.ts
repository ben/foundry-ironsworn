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

// FIXME: this should probably be its own SchemaField type, but this will require a migration
export const ClockSchema = {
	hasClock: new foundry.data.fields.BooleanField(),
	clockTicks: new foundry.data.fields.NumberField({
		initial: 0,
		integer: true,
		min: 0,
		max: 12
	}),
	clockMax: new foundry.data.fields.NumberField({
		initial: 4,
		choices: [4, 6, 8, 10, 12]
	})
}
