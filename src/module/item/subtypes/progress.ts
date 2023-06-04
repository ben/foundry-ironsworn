import { ChallengeRankField } from '../../fields/ChallengeRankField'
import { ProgressTicksField } from '../../fields/ProgressTicksField'
import type { DataSchema } from '../../fields/utils'
import type { IronswornItem } from '../item'
import type { ProgressBase } from '../itemtypes'

export class ProgressData extends foundry.abstract.DataModel<
	ProgressDataSourceData,
	IronswornItem<'progress'>
> {
	static _enableV10Validation = true

	static override defineSchema(): DataSchema<ProgressDataSourceData> {
		const fields = foundry.data.fields
		return {
			subtype: new fields.StringField(),
			starred: new fields.BooleanField({ initial: false }),
			hasTrack: new fields.BooleanField({ initial: true }),
			hasClock: new fields.BooleanField({ initial: false }),
			clockTicks: new fields.NumberField({
				initial: 0,
				integer: true,
				min: 0,
				max: 10
			}),
			clockMax: new fields.NumberField({
				initial: 4,
				integer: true,
				choices: [4, 6, 8, 10]
			}),
			completed: new fields.BooleanField({ initial: false }),
			current: new ProgressTicksField(),
			description: new fields.StringField(),
			rank: new ChallengeRankField()
		}
	}
}
export interface ProgressData extends ProgressDataPropertiesData {}

export interface ProgressDataSourceData extends ProgressBase {
	subtype: string
	starred: boolean
	hasTrack: boolean
	hasClock: boolean
	clockTicks: number
	clockMax: number
}
export interface ProgressDataPropertiesData extends ProgressDataSourceData {}

export interface ProgressDataSource {
	type: 'progress'
	data: ProgressDataSourceData
	system: ProgressDataSourceData
}
export interface ProgressDataProperties {
	type: 'progress'
	data: ProgressDataPropertiesData
	system: ProgressDataPropertiesData
}
