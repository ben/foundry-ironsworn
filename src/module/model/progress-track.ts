import type { ChallengeRank } from 'dataforged'
import type { IronswornActor } from '../actor/actor'
import { ChallengeRankField } from '../fields/ChallengeRankField'
import type { DataSchema } from '../fields/utils'
import { IronswornPrerollDialog } from '../rolls'
import { IronswornSettings } from '../helpers/settings'

/** Represents an Ironsworn progress track. */
export class ProgressTrack<
	Parent extends foundry.abstract.DataModel.AnyOrDoc = foundry.abstract.DataModel.AnyOrDoc
> extends foundry.abstract.DataModel<
	ProgressTrackSource,
	ProgressTrackPropertiesData,
	Parent
> {
	max?: number
	value?: number

	/** The derived progress score, an integer from 0 to 10. */
	get score() {
		return Math.clamped(
			Math.floor(this.ticks / ProgressTrack.TICKS_PER_BOX),
			ProgressTrack.SCORE_MIN,
			ProgressTrack.SCORE_MAX
		)
	}

	/** The number of ticks per unit of progress (in other words, per instance of "mark progress") for this track's challenge rank. */
	get #unit() {
		return ProgressTrack.INCREMENT[this.rank]
	}

	/**
	 * Configure a `Document.update` data object for use in marking this progress track. Use negative `times` to erase progress.
	 * @param times The number of units of progress to be marked (default: `1`).
	 */
	getMarkData(times = 1) {
		return {
			ticks: Math.clamped(
				this.ticks + this.#unit * times,
				ProgressTrack.TICKS_MIN,
				ProgressTrack.TICKS_MAX
			)
		}
	}

	/** Make a progress roll against this progress track. */
	async roll(actor?: IronswornActor, objective?: string) {
		let moveDfId: string | undefined
		const isStarforged =
			actor?.toolset === 'starforged' ??
			IronswornSettings.starforgedToolsEnabled

		switch (this.subtype) {
			case 'vow':
				moveDfId = isStarforged
					? 'Starforged/Moves/Quest/Fulfill_Your_Vow'
					: 'Ironsworn/Moves/Quest/Fulfill_Your_Vow'
				break
			case 'connection':
				if (isStarforged) moveDfId = 'Starforged/Moves/Connection/Forge_a_Bond'
				break
			case 'delve':
				moveDfId = 'Ironsworn/Moves/Delve/Locate_Your_Objective'
				break
			default:
				break
		}

		if (moveDfId == null)
			return await IronswornPrerollDialog.showForProgress(
				objective ?? '(progress)',
				this.score,
				actor ?? undefined,
				moveDfId
			)
		else
			return await IronswornPrerollDialog.showForOfficialMove(moveDfId, {
				actor,
				progress: {
					source: objective ?? '',
					value: this.score
				}
			})
	}

	static override migrateData(source) {
		// @ts-expect-error
		source = super.migrateData(source)
		foundry.abstract.Document._addDataFieldMigration(source, 'current', 'ticks')

		if (source.subtype === 'bond') source.subtype = 'connection'

		return source
	}

	/** Provide a localized label for this progress track's challenge rank. */
	localizeRank() {
		const field = this.schema.getField('rank') as unknown as ChallengeRankField
		return game.i18n.localize(field.choices[this.rank])
	}

	static override defineSchema(): DataSchema<ProgressTrackPropertiesData> {
		const fields = foundry.data.fields
		return {
			ticks: new fields.NumberField({
				initial: this.TICKS_MIN,
				min: this.TICKS_MIN,
				max: this.TICKS_MAX
			}),
			enabled: new fields.BooleanField({ initial: true }),
			rank: new ChallengeRankField(),
			subtype: new fields.StringField({
				choices: {
					progress: 'IRONSWORN.ITEM.SubtypeProgress',
					vow: 'IRONSWORN.ITEM.SubtypeVow',
					connection: 'IRONSWORN.ITEM.SubtypeConnection',
					foe: 'IRONSWORN.ITEM.SubtypeFoe',
					delve: 'IRONSWORN.Delve'
				},
				initial: 'progress'
			})
		}
	}

	/** The minimum score when making a progress roll. */
	static readonly SCORE_MIN = 0
	/** The maximum score when making a progress roll. */
	static readonly SCORE_MAX = 10
	/** The number of ticks in one box of progress. */
	static readonly TICKS_PER_BOX = 4
	/** The number of boxes in a progress track. */
	static readonly BOXES = this.SCORE_MAX
	/** The minimum number of ticks in a progress track. */
	static readonly TICKS_MIN = 0
	/** The maximum number of ticks in a progress track. */
	static readonly TICKS_MAX = this.TICKS_PER_BOX * this.BOXES

	static readonly INCREMENT: Record<
		| ValueOf<(typeof ChallengeRankField)['RANK']>
		| keyof (typeof ChallengeRankField)['RANK'],
		number
	> = {
		[ChallengeRankField.RANK.Troublesome]: 12,
		Troublesome: 12,
		[ChallengeRankField.RANK.Dangerous]: 8,
		Dangerous: 8,
		[ChallengeRankField.RANK.Formidable]: 4,
		Formidable: 4,
		[ChallengeRankField.RANK.Extreme]: 2,
		Extreme: 2,
		[ChallengeRankField.RANK.Epic]: 1,
		Epic: 1
	} as const
}
export interface ProgressTrack<
	Parent extends foundry.abstract.DataModel.AnyOrDoc
> extends foundry.abstract.DataModel<
			ProgressTrackSource,
			ProgressTrackPropertiesData,
			Parent
		>,
		ProgressTrackPropertiesData {}

type ProgressSubtype = 'vow' | 'progress' | 'connection' | 'foe' | 'delve'

export interface ProgressTrackSource {
	rank: ChallengeRank
	ticks: number
	subtype: ProgressSubtype
	enabled?: boolean
}

export interface ProgressTrackPropertiesData extends ProgressTrackSource {}
