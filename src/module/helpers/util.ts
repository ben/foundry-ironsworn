import { ChallengeRank } from '../constants'

/**
 * @returns A localized string label for the challenge rank.
 */
export function localizeRank(rank: ChallengeRank | keyof typeof ChallengeRank) {
	const key = typeof rank === 'string' ? rank : ChallengeRank[rank]
	return game.i18n.localize(`IRONSWORN.CHALLENGERANK.${key}`)
}
