export enum ChallengeRank {
	Troublesome = 1,
	Dangerous = 2,
	Formidable = 3,
	Extreme = 4,
	Epic = 5
}

/**
 * The number of ticks in one unit of progress.
 */
export const RANK_INCREMENTS = {
	[ChallengeRank.Troublesome]: 12,
	[ChallengeRank.Dangerous]: 8,
	[ChallengeRank.Formidable]: 4,
	[ChallengeRank.Extreme]: 2,
	[ChallengeRank.Epic]: 1
}

/**
 * The amount of legacy marked as a reward, when completing a progress track of each challenge rank. (Starforged only).
 */
export const RANK_REWARDS_SF = {
	/**
	 * A troublesome reward that's been downgraded.
	 */
	0: 0,
	[ChallengeRank.Troublesome]: 1,
	[ChallengeRank.Dangerous]: 2,
	[ChallengeRank.Formidable]: 4,
	[ChallengeRank.Extreme]: 8,
	[ChallengeRank.Epic]: 12,
	/**
	 * An epic reward that's been upgraded.
	 */
	6: 16
}
