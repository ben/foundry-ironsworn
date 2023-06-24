import type { IronswornActor } from '../actor/actor'
import { ChallengeRankField } from '../fields/ChallengeRankField'
import type { DataSchema } from '../fields/utils'
import { IronswornSettings } from '../helpers/settings'
import type { ProgressLikeSource, ProgressLikeProperties } from './ProgressLike'
import { ProgressLike } from './ProgressLike'

/** Represents an Ironsworn progress track. */
export class ProgressTrack<
	Parent extends foundry.abstract.DataModel.AnyOrDoc = foundry.abstract.DataModel.AnyOrDoc
> extends ProgressLike<ProgressTrackSource, ProgressTrackProperties, Parent> {
	max?: number
	value?: number

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

	#getDefaultProgressMove(actor?: IronswornActor) {
		const isStarforged =
			actor?.toolset === 'starforged' ??
			IronswornSettings.starforgedToolsEnabled

		switch (this.subtype) {
			case 'vow':
				return isStarforged
					? 'Starforged/Moves/Quest/Fulfill_Your_Vow'
					: 'Ironsworn/Moves/Quest/Fulfill_Your_Vow'
			case 'connection':
				if (isStarforged) return 'Starforged/Moves/Connection/Forge_a_Bond'
				break
			case 'delve':
				return 'Ironsworn/Moves/Delve/Locate_Your_Objective'
		}
		return undefined
	}

	/** Make a progress roll against this progress track. */
	async roll({
		actor,
		objective,
		moveDfid = this.#getDefaultProgressMove(actor)
	}: {
		actor?: IronswornActor
		objective?: string
		moveDfid?: string
	} = {}) {
		return await super.roll({ actor, objective, moveDfid })
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

	static override defineSchema(): DataSchema<
		ProgressTrackSource,
		ProgressTrackProperties
	> {
		const fields = foundry.data.fields
		return {
			ticks: new fields.NumberField({
				initial: this.TICKS_MIN,
				min: this.TICKS_MIN,
				max: this.TICKS_MAX,
				integer: true
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
			ProgressTrackProperties,
			Parent
		>,
		ProgressTrackProperties {}

type ProgressSubtype = 'vow' | 'progress' | 'connection' | 'foe' | 'delve'

export interface ProgressTrackSource extends ProgressLikeSource {
	rank: ChallengeRankField.Rank
	subtype: ProgressSubtype
	enabled?: boolean
}

export interface ProgressTrackProperties
	extends ProgressLikeProperties,
		ProgressTrackSource {}
