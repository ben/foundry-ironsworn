import type { ChallengeRank } from '../../constants'
import { RANK_INCREMENTS } from '../../constants'
import { ChallengeRankField } from '../../fields/ChallengeRankField'
import { ProgressTicksField } from '../../fields/ProgressTicksField'
import type { DataSchema } from '../../fields/utils'
import { IronswornPrerollDialog } from '../../rolls'
import type { IronswornItem } from '../item'
import type { ProgressBase } from '../itemtypes'

export class ProgressData extends foundry.abstract.DataModel<
	ProgressDataSourceData,
	IronswornItem<'progress'>
> {
	static _enableV10Validation = true

	static readonly TICKS = 4
	static readonly BOXES = 10

	/** The derived progress score, which is an integer from 0 to 10 */
	get score() {
		return Math.min(
			Math.floor(this.current / ProgressData.TICKS),
			ProgressData.BOXES
		)
	}

	async markProgress(units = 1) {
		const increment = RANK_INCREMENTS[this.rank] * units
		let newValue = this.current + increment
		newValue = Math.min(newValue, 40)
		newValue = Math.max(newValue, 0)
		return await this.parent.update({ 'system.current': newValue })
	}

	async fulfill() {
		let moveDfId: string | undefined
		if (this.subtype === 'vow') {
			const toolset = this.parent.actor?.toolset ?? 'starforged'
			moveDfId =
				toolset === 'starforged'
					? 'Starforged/Moves/Quest/Fulfill_Your_Vow'
					: 'Ironsworn/Moves/Quest/Fulfill_Your_Vow'
		}

		return await IronswornPrerollDialog.showForProgress(
			this.parent.name ?? '(progress)',
			this.score,
			this.parent.actor ?? undefined,
			moveDfId
		)
	}

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
	data: ProgressData
	system: ProgressData
}
