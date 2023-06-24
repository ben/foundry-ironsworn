import type { CharacterData } from '../actor/config'
import { ChallengeRankField } from '../fields/ChallengeRankField'
import type { DataSchema } from '../fields/utils'
import type { ProgressLikeSource, ProgressLikeProperties } from './ProgressLike'
import { ProgressLike } from './ProgressLike'

/** Represents a Starforged legacy track. */

export class LegacyTrack extends ProgressLike<
	LegacyTrackSource,
	LegacyTrackProperties,
	CharacterData
> {
	/** The number of ticks marked on the legacy track for completing a progress track of the given rank. */
	static readonly REWARD: Record<
		LegacyTrack.RewardRank | keyof (typeof ChallengeRankField)['RANK'],
		number
	> = {
		/** Use for Troublesome tracks that have their reward reduced (e.g. from selecting that option after a weak hit from a progress move). */
		0: 0,
		[ChallengeRankField.RANK.Troublesome]: 1,
		Troublesome: 1,
		[ChallengeRankField.RANK.Dangerous]: 2,
		Dangerous: 2,
		[ChallengeRankField.RANK.Formidable]: 4,
		Formidable: 4,
		[ChallengeRankField.RANK.Extreme]: 8,
		Extreme: 8,
		[ChallengeRankField.RANK.Epic]: 12,
		Epic: 12,
		/** Use for Epic tracks that have their reward increased (e.g. from selecting that option after a weak hit from a progress move). */
		6: 16
	} as const

	static readonly XP_MIN = 0
	static readonly XP_PER_BOX = 2
	static readonly XP_PER_BOX_OVERFLOW = 1
	static readonly TICKS_TO_OVERFLOW =
		LegacyTrack.BOXES * LegacyTrack.TICKS_PER_BOX

	getMarkData(
		rewardRank: LegacyTrack.RewardRank = ChallengeRankField.RANK.Troublesome
	): { ticks: number } {
		return { ticks: this.ticks + LegacyTrack.REWARD[rewardRank] }
	}

	async roll({ moveDfid }: { moveDfid?: string } = {}): Promise<any> {
		const actor = this.parent.parent
		return await super.roll({ actor, moveDfid })
	}

	protected _validateModel(data: LegacyTrackSource): void {
		super._validateModel(data)
		const xpEarned = LegacyTrack.#getXpEarned(data.ticks)
		if (data.xpSpent > xpEarned)
			throw new Error(
				`xpSpent (${data.xpSpent}) exceeds computed xpEarned (${xpEarned})`
			)
	}

	get overflowProgress() {
		if (this.score <= LegacyTrack.SCORE_MAX) return null
		return LegacyTrack.getFilledBoxes(this.ticks) - this.score
	}

	get xpEarned() {
		return LegacyTrack.#getXpEarned(this.ticks)
	}

	static #getXpEarned(ticks: number) {
		const fullRateBoxes = this.getScore(ticks)

		const fullRateXp = fullRateBoxes * LegacyTrack.XP_PER_BOX

		if (ticks <= this.TICKS_TO_OVERFLOW) return fullRateXp

		const overflowBoxes = this.getScore(ticks, true) - this.BOXES

		return fullRateXp + overflowBoxes * LegacyTrack.XP_PER_BOX_OVERFLOW
	}

	static override defineSchema(): DataSchema<
		LegacyTrackSource,
		LegacyTrackProperties
	> {
		const fields = foundry.data.fields
		return {
			ticks: new fields.NumberField({
				initial: this.TICKS_MIN,
				min: this.TICKS_MIN,
				integer: true
			}),
			xpSpent: new fields.NumberField({
				initial: this.XP_MIN,
				min: this.XP_MIN,
				integer: true
			})
		}
	}
}
export interface LegacyTrack
	extends ProgressLike<LegacyTrackSource, LegacyTrackProperties, CharacterData>,
		LegacyTrackProperties {}
export interface LegacyTrackProperties
	extends ProgressLikeProperties,
		LegacyTrackSource {}
export interface LegacyTrackSource extends ProgressLikeSource {
	xpSpent: number
}

export namespace LegacyTrack {
	export type RewardRank = 0 | ChallengeRankField.Rank | 6
}
