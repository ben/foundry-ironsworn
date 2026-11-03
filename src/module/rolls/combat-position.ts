/**
 * A character's position in a fight. Starforged and Sundered Isles call this
 * "in control" / "in a bad spot"; classic Ironsworn calls it having or not
 * having initiative. Both are stored in the same `combatPosition` field.
 * Which moves set it is in `move-outcome-effects.ts`.
 */
export type CombatPosition = 'inControl' | 'inABadSpot' | 'none'

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
