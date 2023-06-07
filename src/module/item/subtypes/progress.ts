import { clamp } from 'lodash-es'
import { RANK_INCREMENTS } from '../../constants'
import { ChallengeRankField } from '../../fields/ChallengeRankField'
import { ProgressTicksField } from '../../fields/ProgressTicksField'
import type { DataSchema } from '../../fields/utils'
import { localizeRank } from '../../helpers/util'
import { IronswornPrerollDialog } from '../../rolls'
import type { IronswornItem } from '../item'
import type { ProgressBase } from '../itemtypes'
import { ClockSchema } from './common'

export class ProgressData extends foundry.abstract.DataModel<
	ProgressDataSourceData,
	IronswornItem<'progress'>
> {
	static _enableV10Validation = true

	static readonly SCORE_MIN = 0
	static readonly SCORE_MAX = 10
	static readonly TICKS_PER_BOX = 4
	static readonly BOXES = this.SCORE_MAX
	static readonly TICKS_MIN = 0
	static readonly TICKS_MAX = this.TICKS_PER_BOX * this.BOXES

	/** The derived progress score, which is an integer from 0 to 10. */
	get score() {
		return Math.min(
			Math.floor(this.current / ProgressData.TICKS_PER_BOX),
			ProgressData.SCORE_MAX
		)
	}

	/** The number of ticks per unit of progress (in other words, per instance of "mark progress") for this track's challenge rank. */
	get unit() {
		return RANK_INCREMENTS[this.rank]
	}

	/** Mark progress on this track. Use negative `units` to erase progress.
	 * @param units The number of units of progress to be marked (default: `1`).
	 */
	async markProgress(units = 1) {
		return await this.parent.update({
			'system.current': clamp(
				this.current + this.unit * units,
				ProgressData.TICKS_MIN,
				ProgressData.TICKS_MAX
			)
		})
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

	/** Provide a localized label for this progress track's challenge rank. */
	localizeRank() {
		return localizeRank(this.rank)
	}

	static override defineSchema(): DataSchema<ProgressDataSourceData> {
		const fields = foundry.data.fields
		return {
			subtype: new fields.StringField({ initial: 'progress' }),
			starred: new fields.BooleanField({ initial: false }),
			hasTrack: new fields.BooleanField({ initial: true }),
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
			}),
			completed: new fields.BooleanField({ initial: false }),
			current: new ProgressTicksField(),
			description: new fields.HTMLField(),
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
