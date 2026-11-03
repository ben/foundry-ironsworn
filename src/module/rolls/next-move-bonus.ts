import { RollOutcome } from './ironsworn-roll'

const { Strong_hit, Weak_hit } = RollOutcome

/**
 * Move outcomes that grant a bonus to the next move, keyed by Datasworn move
 * ID: "add +1 on your next move (not a progress move)". Taken from the move
 * text in the Datasworn packages. Several are one choice among others, so the
 * roll card offers the bonus rather than applying it.
 *
 * Progress moves are only listed if a roll can reach them with its move ID
 * attached. Classic's Reach Your Destination is left out: it is rolled from a
 * generic progress track, which doesn't know which move it's for.
 */
export const NEXT_MOVE_BONUS_OUTCOMES: Record<
	string,
	Partial<Record<RollOutcome, number>>
> = {
	// Starforged
	'move:starforged/adventure/secure_an_advantage': {
		[Strong_hit]: 1,
		[Weak_hit]: 1
	},
	'move:starforged/combat/gain_ground': { [Strong_hit]: 1, [Weak_hit]: 1 },
	'move:starforged/scene_challenge/secure_an_advantage': {
		[Strong_hit]: 1,
		[Weak_hit]: 1
	},

	// Classic Ironsworn, Delve and Lodestar
	'move:classic/adventure/secure_an_advantage': { [Strong_hit]: 1 },
	'move:delve/delve/locate_your_objective': { [Strong_hit]: 1 },
	'move:lodestar/scene_challenge/secure_an_advantage': {
		[Strong_hit]: 1,
		[Weak_hit]: 1
	}
}

/**
 * The next-move bonus a move's outcome can grant.
 * @returns `undefined` when the outcome doesn't grant one.
 */
export function nextMoveBonusForOutcome(
	moveDsId: string | undefined,
	outcome: RollOutcome | undefined
): number | undefined {
	if (moveDsId == null || outcome == null) return undefined
	return NEXT_MOVE_BONUS_OUTCOMES[moveDsId]?.[outcome]
}
