import { RollOutcome } from './ironsworn-roll'

/**
 * A character's position in a fight. Starforged and Sundered Isles call this
 * "in control" / "in a bad spot"; classic Ironsworn calls it having or not
 * having initiative. Both are stored in the same `combatPosition` field.
 */
export type CombatPosition = 'inControl' | 'inABadSpot' | 'none'

type PositionsByOutcome = Partial<Record<RollOutcome, CombatPosition[]>>

const { Strong_hit, Weak_hit, Miss } = RollOutcome

const IN_CONTROL: CombatPosition[] = ['inControl']
const BAD_SPOT: CombatPosition[] = ['inABadSpot']
const CHOICE: CombatPosition[] = ['inControl', 'inABadSpot']

/** "Enter the Fray": the weak hit offers a choice between momentum and position. */
const ENTER_THE_FRAY: PositionsByOutcome = {
	[Strong_hit]: IN_CONTROL,
	[Weak_hit]: CHOICE,
	[Miss]: BAD_SPOT
}

/** Strong hit takes control; anything less leaves you in a bad spot. */
const CONTROL_ON_STRONG_HIT: PositionsByOutcome = {
	[Strong_hit]: IN_CONTROL,
	[Weak_hit]: BAD_SPOT,
	[Miss]: BAD_SPOT
}

/**
 * The combat position each combat move's outcome leaves the character in,
 * keyed by Datasworn move ID. An outcome with more than one position is a
 * choice the player makes. Taken from the move text in the Datasworn packages.
 */
export const COMBAT_MOVE_POSITIONS: Record<string, PositionsByOutcome> = {
	// Starforged
	'move:starforged/combat/enter_the_fray': ENTER_THE_FRAY,
	'move:starforged/combat/gain_ground': {
		[Strong_hit]: IN_CONTROL,
		[Weak_hit]: IN_CONTROL,
		[Miss]: BAD_SPOT
	},
	'move:starforged/combat/react_under_fire': CONTROL_ON_STRONG_HIT,
	'move:starforged/combat/strike': CONTROL_ON_STRONG_HIT,
	'move:starforged/combat/clash': CONTROL_ON_STRONG_HIT,
	// "If the fight continues..." — or it may be over.
	'move:starforged/combat/take_decisive_action': {
		[Strong_hit]: ['inControl', 'none'],
		[Weak_hit]: ['inABadSpot', 'none']
	},

	// Sundered Isles (only Enter the Fray is overridden; the rest are Starforged's)
	'move:sundered_isles/combat/enter_the_fray': ENTER_THE_FRAY,

	// Classic Ironsworn: initiative
	'move:classic/combat/enter_the_fray': ENTER_THE_FRAY,
	'move:classic/combat/strike': CONTROL_ON_STRONG_HIT,
	'move:classic/combat/clash': CONTROL_ON_STRONG_HIT,
	// The "Grant first strike" boast gives your foe initiative.
	'move:classic/relationship/draw_the_circle': {
		[Strong_hit]: CHOICE,
		[Weak_hit]: CHOICE,
		[Miss]: BAD_SPOT
	}
}

/**
 * The combat positions a move's outcome can leave the character in.
 * @returns An empty array when the move doesn't affect combat position.
 */
export function combatPositionsForOutcome(
	moveDsId: string | undefined,
	outcome: RollOutcome | undefined
): CombatPosition[] {
	if (moveDsId == null || outcome == null) return []
	return COMBAT_MOVE_POSITIONS[moveDsId]?.[outcome] ?? []
}

/** Classic Ironsworn moves use "initiative" terminology, so we need to check for that. */
export function isClassicMove(moveDsId: string | undefined): boolean {
	return moveDsId?.startsWith('move:classic/') ?? false
}

/** The i18n key for a combat position, in the wording of the move's game. */
export function combatPositionLabelKey(
	position: CombatPosition,
	classic: boolean
): string {
	switch (position) {
		case 'inControl':
			return classic
				? 'IRONSWORN.CombatPosition.YouHaveInitiative'
				: 'IRONSWORN.CombatPosition.InControl'
		case 'inABadSpot':
			return classic
				? 'IRONSWORN.CombatPosition.FoeHasInitiative'
				: 'IRONSWORN.CombatPosition.InABadSpot'
		default:
			return 'IRONSWORN.CombatPosition.NotInCombat'
	}
}
