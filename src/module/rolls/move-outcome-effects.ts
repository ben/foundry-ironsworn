import type { CombatPosition } from './combat-position'
import { RollOutcome } from './ironsworn-roll'

/** A character meter that a move outcome can raise. */
export type OutcomeMeter = 'momentum' | 'health' | 'spirit' | 'supply'

/** An impact that, when marked, rules out a gain ("if you are not wounded"). */
export type BlockingImpact = 'wounded' | 'shaken'

/** Something a move outcome gives the character, applied by a roll-card button. */
export type OutcomeGain =
	| {
			kind: 'meter'
			meter: OutcomeMeter
			value: number
			unlessImpact?: BlockingImpact
	  }
	| { kind: 'nextMoveBonus'; value: number }

/**
 * Gains the player picks from: "choose one", "choose two". Only the options
 * that can be applied with a button are listed; the move text names the rest.
 */
export interface OutcomeChoice {
	choose: number
	options: OutcomeGain[]
}

export interface OutcomeEffects {
	/** Each entry is a gain applied as stated, or a choice between gains. */
	gains?: Array<OutcomeGain | OutcomeChoice>
	/**
	 * The combat positions the outcome can leave the character in. More than
	 * one is a choice the player makes.
	 */
	positions?: CombatPosition[]
}

type EffectsByOutcome = Partial<Record<RollOutcome, OutcomeEffects>>

const { Strong_hit, Weak_hit, Miss } = RollOutcome

const momentum = (value: number): OutcomeGain => ({
	kind: 'meter',
	meter: 'momentum',
	value
})
const health = (value: number, unlessImpact?: BlockingImpact): OutcomeGain => ({
	kind: 'meter',
	meter: 'health',
	value,
	unlessImpact
})
const spirit = (value: number, unlessImpact?: BlockingImpact): OutcomeGain => ({
	kind: 'meter',
	meter: 'spirit',
	value,
	unlessImpact
})
const supply = (value: number): OutcomeGain => ({
	kind: 'meter',
	meter: 'supply',
	value
})
const nextMove = (value = 1): OutcomeGain => ({ kind: 'nextMoveBonus', value })
const chooseOne = (...options: OutcomeGain[]): OutcomeChoice => ({
	choose: 1,
	options
})
const chooseTwo = (...options: OutcomeGain[]): OutcomeChoice => ({
	choose: 2,
	options
})

const IN_CONTROL: CombatPosition[] = ['inControl']
const BAD_SPOT: CombatPosition[] = ['inABadSpot']
const EITHER_POSITION: CombatPosition[] = ['inControl', 'inABadSpot']

/** Strong hit takes control; anything less leaves you in a bad spot. */
const CONTROL_ON_STRONG_HIT: EffectsByOutcome = {
	[Strong_hit]: { positions: IN_CONTROL },
	[Weak_hit]: { positions: BAD_SPOT },
	[Miss]: { positions: BAD_SPOT }
}

/**
 * Enter the Fray: the weak hit is a choice between +2 momentum and control,
 * so either position can follow.
 */
const ENTER_THE_FRAY: EffectsByOutcome = {
	[Strong_hit]: { gains: [momentum(2)], positions: IN_CONTROL },
	[Weak_hit]: { gains: [momentum(2)], positions: EITHER_POSITION },
	[Miss]: { positions: BAD_SPOT }
}

/** Secure an Advantage in Starforged and its scene challenges. */
const SECURE_AN_ADVANTAGE: EffectsByOutcome = {
	[Strong_hit]: { gains: [momentum(2), nextMove()] },
	[Weak_hit]: { gains: [chooseOne(momentum(2), nextMove())] }
}

/**
 * Resupply in Starforged and Sundered Isles. The supply option depends on
 * whether you are unprepared, so only the other option's momentum is listed.
 */
const SF_RESUPPLY: EffectsByOutcome = {
	[Strong_hit]: { gains: [momentum(1)] },
	[Weak_hit]: { gains: [momentum(1)] }
}

/**
 * Withstand Damage: the integrity option is for a vehicle, which the roll
 * doesn't know, so only "Ride it out" is listed.
 */
const WITHSTAND_DAMAGE: EffectsByOutcome = {
	[Strong_hit]: { gains: [momentum(1)] }
}

const STRONG_MOMENTUM_1: EffectsByOutcome = {
	[Strong_hit]: { gains: [momentum(1)] }
}

const MOMENTUM_2_THEN_1: EffectsByOutcome = {
	[Strong_hit]: { gains: [momentum(2)] },
	[Weak_hit]: { gains: [momentum(1)] }
}

/**
 * The resource gains, next-move bonuses and combat positions that move
 * outcomes give, keyed by Datasworn move ID. Taken from the move text in the
 * Datasworn packages.
 *
 * Only plain gains are listed. Gains that depend on the character's impacts
 * ("if you are shaken… otherwise…"), trades ("Lose Momentum (-1) in exchange
 * for +1 health"), gains for allies or companions, and "up to" or "for each"
 * amounts are left to the player, as are costs and progress.
 *
 * Progress moves are listed too, but a roll only carries its move ID when the
 * track knows which move it's for (vows, Delve sites).
 */
export const MOVE_OUTCOME_EFFECTS: Record<string, EffectsByOutcome> = {
	// Starforged
	'move:starforged/adventure/face_danger': STRONG_MOMENTUM_1,
	'move:starforged/adventure/secure_an_advantage': SECURE_AN_ADVANTAGE,
	'move:starforged/adventure/gather_information': MOMENTUM_2_THEN_1,
	'move:starforged/adventure/compel': {
		[Strong_hit]: { gains: [momentum(1)] },
		[Weak_hit]: { gains: [momentum(1)] }
	},
	'move:starforged/adventure/check_your_gear': STRONG_MOMENTUM_1,
	'move:starforged/quest/swear_an_iron_vow': MOMENTUM_2_THEN_1,
	'move:starforged/connection/develop_your_relationship': {
		[Weak_hit]: { gains: [momentum(2)] }
	},
	// Or "Gain progress" on the expedition
	'move:starforged/exploration/explore_a_waypoint': MOMENTUM_2_THEN_1,
	'move:starforged/exploration/set_a_course': STRONG_MOMENTUM_1,
	'move:starforged/combat/enter_the_fray': ENTER_THE_FRAY,
	'move:starforged/combat/gain_ground': {
		// Or "Mark progress"
		[Strong_hit]: {
			gains: [chooseTwo(momentum(2), nextMove())],
			positions: IN_CONTROL
		},
		[Weak_hit]: {
			gains: [chooseOne(momentum(2), nextMove())],
			positions: IN_CONTROL
		},
		[Miss]: { positions: BAD_SPOT }
	},
	'move:starforged/combat/react_under_fire': {
		...CONTROL_ON_STRONG_HIT,
		[Strong_hit]: { gains: [momentum(1)], positions: IN_CONTROL }
	},
	'move:starforged/combat/strike': CONTROL_ON_STRONG_HIT,
	'move:starforged/combat/clash': CONTROL_ON_STRONG_HIT,
	// "If any objectives remain and the fight continues…", or it may be over.
	'move:starforged/combat/take_decisive_action': {
		[Strong_hit]: { gains: [momentum(1)], positions: ['inControl', 'none'] },
		[Weak_hit]: { positions: ['inABadSpot', 'none'] }
	},
	'move:starforged/combat/battle': {
		[Strong_hit]: { gains: [momentum(2)] }
	},
	'move:starforged/suffer/endure_harm': {
		[Strong_hit]: { gains: [chooseOne(health(1, 'wounded'), momentum(1))] }
	},
	'move:starforged/suffer/endure_stress': {
		[Strong_hit]: { gains: [chooseOne(spirit(1, 'shaken'), momentum(1))] }
	},
	'move:starforged/suffer/withstand_damage': WITHSTAND_DAMAGE,
	'move:starforged/recover/resupply': SF_RESUPPLY,
	'move:starforged/scene_challenge/secure_an_advantage': SECURE_AN_ADVANTAGE,

	// Sundered Isles (only the moves it overrides; the rest are Starforged's)
	'move:sundered_isles/exploration/set_a_course': STRONG_MOMENTUM_1,
	'move:sundered_isles/combat/enter_the_fray': ENTER_THE_FRAY,
	'move:sundered_isles/suffer/withstand_damage': WITHSTAND_DAMAGE,
	'move:sundered_isles/recover/resupply': SF_RESUPPLY,

	// Classic Ironsworn
	'move:classic/adventure/face_danger': STRONG_MOMENTUM_1,
	'move:classic/adventure/secure_an_advantage': {
		[Strong_hit]: { gains: [chooseOne(nextMove(), momentum(2))] },
		[Weak_hit]: { gains: [momentum(1)] }
	},
	'move:classic/adventure/gather_information': MOMENTUM_2_THEN_1,
	'move:classic/adventure/resupply': {
		[Strong_hit]: { gains: [supply(2)] }
	},
	// Or "Partake" or "Prepare". Each ally chooses for themselves.
	'move:classic/adventure/make_camp': {
		[Strong_hit]: { gains: [chooseTwo(health(1), spirit(1), momentum(1))] },
		[Weak_hit]: { gains: [chooseOne(health(1), spirit(1), momentum(1))] }
	},
	'move:classic/adventure/reach_your_destination': {
		[Strong_hit]: { gains: [chooseOne(nextMove(), momentum(1))] }
	},
	'move:classic/relationship/compel': {
		[Strong_hit]: { gains: [momentum(1)] },
		[Weak_hit]: { gains: [momentum(1)] }
	},
	// Boasts add momentum too, and "Grant first strike" gives your foe initiative.
	'move:classic/relationship/draw_the_circle': {
		[Strong_hit]: { gains: [momentum(1)], positions: EITHER_POSITION },
		[Weak_hit]: { positions: EITHER_POSITION },
		[Miss]: { positions: BAD_SPOT }
	},
	'move:classic/relationship/forge_a_bond': {
		[Strong_hit]: { gains: [chooseOne(spirit(1), momentum(2))] }
	},
	'move:classic/relationship/test_your_bond': {
		[Strong_hit]: { gains: [chooseOne(spirit(1), momentum(2))] }
	},
	'move:classic/combat/enter_the_fray': ENTER_THE_FRAY,
	'move:classic/combat/strike': CONTROL_ON_STRONG_HIT,
	// Or "Inflict +1 harm"
	'move:classic/combat/clash': {
		...CONTROL_ON_STRONG_HIT,
		[Strong_hit]: { gains: [momentum(1)], positions: IN_CONTROL }
	},
	'move:classic/combat/battle': {
		[Strong_hit]: { gains: [momentum(2)] }
	},
	// Or "Shake it off", a trade of momentum for health or spirit
	'move:classic/suffer/endure_harm': STRONG_MOMENTUM_1,
	'move:classic/suffer/endure_stress': STRONG_MOMENTUM_1,
	'move:classic/quest/swear_an_iron_vow': MOMENTUM_2_THEN_1,

	// Delve
	'move:delve/delve/check_your_gear': {
		[Strong_hit]: { gains: [momentum(1)] },
		[Weak_hit]: { gains: [momentum(1)] }
	},
	'move:delve/delve/locate_your_objective': {
		[Strong_hit]: { gains: [chooseOne(nextMove(), momentum(1))] }
	},
	'move:delve/delve/escape_the_depths': STRONG_MOMENTUM_1,

	// Lodestar
	'move:lodestar/adventure/follow_a_path': STRONG_MOMENTUM_1,
	'move:lodestar/adventure/face_danger': STRONG_MOMENTUM_1,
	'move:lodestar/scene_challenge/secure_an_advantage': SECURE_AN_ADVANTAGE
}

/** The effects of a move's outcome, if it has any. */
export function outcomeEffects(
	moveDsId: string | undefined,
	outcome: RollOutcome | undefined
): OutcomeEffects | undefined {
	if (moveDsId == null || outcome == null) return undefined
	return MOVE_OUTCOME_EFFECTS[moveDsId]?.[outcome]
}

export function isOutcomeChoice(
	entry: OutcomeGain | OutcomeChoice
): entry is OutcomeChoice {
	return 'choose' in entry
}
