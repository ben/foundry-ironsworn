import { ChallengeRank } from '../constants'

export function capitalize(txt: string) {
	const [first, ...rest] = txt
	return `${first.toUpperCase()}${rest.join('')}`
}

/**
 * @returns A localized string label for the challenge rank.
 */
export function localizeRank(rank: ChallengeRank) {
	return game.i18n.localize(`IRONSWORN.CHALLENGERANK.${ChallengeRank[rank]}`)
}
