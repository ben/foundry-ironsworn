import { ChallengeRank } from './fields/ChallengeRank'

/**
 * The number of ticks in one unit of progress.
 */
export const RANK_INCREMENTS = {
	[ChallengeRank.RANK.Troublesome]: 12,
	[ChallengeRank.RANK.Dangerous]: 8,
	[ChallengeRank.RANK.Formidable]: 4,
	[ChallengeRank.RANK.Extreme]: 2,
	[ChallengeRank.RANK.Epic]: 1
}

/**
 * The amount of legacy marked as a reward, when completing a progress track of each challenge rank. (Starforged only).
 */
export const RANK_REWARDS_SF = {
	/**
	 * A troublesome reward that's been downgraded.
	 */
	0: 0,
	[ChallengeRank.RANK.Troublesome]: 1,
	[ChallengeRank.RANK.Dangerous]: 2,
	[ChallengeRank.RANK.Formidable]: 4,
	[ChallengeRank.RANK.Extreme]: 8,
	[ChallengeRank.RANK.Epic]: 12,
	/**
	 * An epic reward that's been upgraded.
	 */
	6: 16
}
