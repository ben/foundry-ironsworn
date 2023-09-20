import { ForeignDocumentField } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/fields.mjs'
import type { IronswornActor } from '../actor/actor'
import { getFoundryMoveByDfId, hashLookup } from '../dataforged'
import { ChallengeRank } from '../fields/ChallengeRank'
import type { DataSchema } from '../fields/utils'
import { IronswornSettings } from '../helpers/settings'
import { IronswornItem } from '../item/item'
import type { ProgressLikeSource, ProgressLikeProperties } from './ProgressLike'
import { ProgressLike } from './ProgressLike'

/** Represents an Ironsworn progress track. */
export class ProgressTrack<
	Parent extends foundry.abstract.DataModel.AnyOrDoc = foundry.abstract.DataModel.AnyOrDoc
> extends ProgressLike<ProgressTrackSource, ProgressTrackProperties, Parent> {
	// max?: number
	// value?: number

	/** The number of ticks per unit of progress (in other words, per instance of "mark progress") for this track's challenge rank. */
	get #unit() {
		return ProgressTrack.INCREMENT[this.rank]
	}

	/**
	 * Configure a `Document.update` data object for use in marking this progress track. Use negative `times` to erase progress.
	 *
	 * Note that this only creates the data object. You still need to send it with e.g. `Document.update`.
	 *
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

		// if (source.subtype === 'bond') source.subtype = 'connection'

		if (typeof source.subtype === 'string') {
			const subtype = source.subtype as ProgressSubtype | 'bond'
			const isStarforged = true
			let dfid: string | null = null
			switch (subtype) {
				case 'vow':
					dfid = isStarforged
						? 'Starforged/Moves/Quest/Fulfill_Your_Vow'
						: 'Ironsworn/Moves/Quest/Fulfill_Your_Vow'
					break
				case 'bond':
				case 'connection':
					dfid = 'Starforged/Moves/Connection/Forge_a_Bond'
					break
			}
			if (dfid != null) {
				source.move = hashLookup(dfid)
				// fvttt would attempt Item.get(id, {pack: somePack})
				// but how do i get it to initialize with specific options in order to specify the pack in the first place???
			}
		}

		return source
	}

	/** Provide a localized label for this progress track's challenge rank. */
	localizeRank() {
		const field = this.schema.getField('rank') as unknown as ChallengeRank
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
			rank: new ChallengeRank(),
			// TODO: improve the typing for this
			move: new fields.ForeignDocumentField(foundry.documents.BaseItem)
		}
	}

	/**
	 * The number of ticks in one unit of progress, for each challenge rank.
	 */
	static readonly INCREMENT: Record<
		ChallengeRank.Value | keyof (typeof ChallengeRank)['RANK'],
		number
	> = {
		[ChallengeRank.RANK.Troublesome]: 12,
		Troublesome: 12,
		[ChallengeRank.RANK.Dangerous]: 8,
		Dangerous: 8,
		[ChallengeRank.RANK.Formidable]: 4,
		Formidable: 4,
		[ChallengeRank.RANK.Extreme]: 2,
		Extreme: 2,
		[ChallengeRank.RANK.Epic]: 1,
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
	rank: ChallengeRank.Value
	subtype: ProgressSubtype
	enabled?: boolean
	move?: string
}

export interface ProgressTrackProperties
	extends ProgressLikeProperties,
		Omit<ProgressTrackSource, 'move'> {
	move: IronswornItem<'sfmove'> | null
}
