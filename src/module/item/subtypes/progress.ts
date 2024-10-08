import { clamp } from 'lodash-es'
import { RANK_INCREMENTS } from '../../constants'
import { ChallengeRank } from '../../fields/ChallengeRank'
import { ProgressTicksField } from '../../fields/ProgressTicksField'
import type { DataSchema } from '../../fields/utils'
import { IronswornPrerollDialog } from '../../rolls'
import type { IronswornItem } from '../item'
import type { ProgressBase } from '../config'
import { IronswornSettings } from '../../helpers/settings'

export class ProgressModel extends foundry.abstract.TypeDataModel<
	ProgressDataSourceData,
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
			Math.floor(this.current / ProgressModel.TICKS_PER_BOX),
			ProgressModel.SCORE_MAX
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
				ProgressModel.TICKS_MIN,
				ProgressModel.TICKS_MAX
			)
		})
	}

	async fulfill() {
		let moveDsId: string | undefined
		if (this.subtype === 'vow') {
			moveDsId = IronswornSettings.enabledRulesets.includes('starforged')
				? 'move:starforged/quest/fulfill_your_vow'
				: 'move:classic/quest/fulfill_your_vow'
		}

		return await IronswornPrerollDialog.showForProgress(
			this.parent.name ?? '(progress)',
			this.score,
			this.parent.actor ?? undefined,
			moveDsId
		)
	}

	/** Provide a localized label for this progress track's challenge rank. */
	localizeRank() {
		return ChallengeRank.localizeValue(this.rank)
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
			rank: new ChallengeRank()
		}
	}
}
export interface ProgressModel extends ProgressDataPropertiesData {}

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
	data: ProgressModel
	system: ProgressModel
}
