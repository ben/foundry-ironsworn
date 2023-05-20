// import { ChallengeRankField } from '../../fields/ChallengeRankField'
// import { ProgressTicksField } from '../../fields/ProgressTicksField'
// import { DataSchema } from '../../fields/utils'
// import { IronswornItem } from '../item'
// import { ProgressDataSourceData } from '../itemtypes'

// export class ProgressData extends foundry.abstract.DataModel<
// 	DataSchema<ProgressDataSourceData>,
// 	IronswornItem<'progress'>
// > {
// 	static override defineSchema(): DataSchema<ProgressDataSourceData> {
// 		const fields = foundry.data.fields
// 		return {
// 			clockMax: new fields.NumberField(),
// 			clockTicks: new fields.NumberField(),
// 			completed: new fields.BooleanField(),
// 			current: new ProgressTicksField(),
// 			description: new fields.HTMLField(),
// 			hasClock: new fields.BooleanField(),
// 			hasTrack: new fields.BooleanField(),
// 			rank: new ChallengeRankField(),
// 			starred: new fields.BooleanField(),
// 			subtype: new fields.StringField({ choices: ['progress', 'vow', 'foe'] })
// 		}
// 	}
// }
