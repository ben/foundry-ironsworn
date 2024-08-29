export declare enum DFRollType {
	Action = 'Action roll',
	Progress = 'Progress roll'
}

export declare enum DFRollMethod {
	/**
	 * When rolling with this move trigger option, *every* stat or progress track of the `Using` key is rolled.
	 */
	All = 'All',
	/**
	 * When rolling with this move trigger option, use the highest/best option from the `Using` key.
	 */
	Highest = 'Highest',
	/**
	 * When rolling with this move trigger option, use the lowest/worst option from the `Using` key.
	 */
	Lowest = 'Lowest',
	/**
	 * When rolling with this move trigger option, the user picks which stat to use.
	 *
	 * This is the default option for triggers that offer a single stat.
	 */
	Any = 'Any',
	/**
	 * This move trigger option has no roll method of its own, and must inherit its roll from another move trigger option.
	 *
	 * If the parent's `Using` is defined, the inherited roll must use one of those stats/progress tracks.
	 *
	 * Typically appears on children of `IAlterMove`.
	 */
	Inherit = 'Inherit',
	/**
	 * The move trigger option results in an automatic strong hit - no roll required.
	 */
	StrongHit = 'Strong Hit',
	/**
	 * The move trigger option results in an automatic weak hit - no roll required.
	 */
	WeakHit = 'Weak Hit'
}

export declare enum DFStat {
	Edge = 'Edge',
	Heart = 'Heart',
	Iron = 'Iron',
	Shadow = 'Shadow',
	Wits = 'Wits'
}

export declare enum DFPlayerConditionMeter {
	Health = 'Health',
	Spirit = 'Spirit',
	Supply = 'Supply'
}

export declare enum DFProgressTypeIronsworn {
	Combat = 'Combat',
	Vow = 'Vow',
	Journey = 'Journey',
	Delve = 'Delve',
	SceneChallenge = 'Scene Challenge',
	Bonds = 'Bonds'
}

export declare enum DFProgressTypeStarforged {
	Combat = 'Combat',
	Vow = 'Vow',
	Expedition = 'Expedition',
	Connection = 'Connection',
	SceneChallenge = 'Scene Challenge',
	Quests = 'Quests Legacy',
	Bonds = 'Bonds Legacy',
	Discoveries = 'Discoveries Legacy'
}

export declare enum DFMoveOutcome {
	Miss = 0,
	'Weak Hit' = 1,
	'Strong Hit' = 2
}

export declare interface DFIConditionMeter {
	$id: string
	Name: string
	/**
	 * The minimum value of the meter. Usually this is 0. Momentum is currently the only exception to this and goes as low as -6.
	 */
	Min: number
	/**
	 * The maximum value of the meter.
	 */
	Max: number
	/**
	 * The initial value of the meter.
	 */
	Value: number
	/**
	 * @pattern ^(Starforged|Ironsworn)/Assets/[A-z_-]+/[A-z_-]+/Condition_Meter$
	 */
	$id: string
	Min: 0
	/**
	 * The conditions that can apply to this meter.
	 */
	Conditions: MeterCondition[]
	Aliases?: MeterAlias[] | undefined
}

export declare interface DFICustomStatOption {
	/**
	 * @pattern ^(Starforged|Ironsworn)/Moves/([A-z_-]+|Assets/[A-z_-]+/[A-z_-]+/Abilities/[0-9]+)/[A-z_-]+/Trigger/Options/[0-9]+/Custom_stat/[A-z_-]+$
	 */
	$id: string
	/**
	 * The name/label for this specific value of the custom stat.
	 */
	Name: string
	/**
	 * The numeric value to be used as +stat when making an Action Roll.
	 */
	Value: number
}

export declare interface DFICustomStat {
	/**
	 * @pattern ^(Starforged|Ironsworn)/Moves/([A-z_-]+|Assets/[A-z_-]+/[A-z_-]+/Abilities/[0-9]+)/[A-z_-]+/Trigger/Options/[0-9]+/Custom_stat$
	 */
	$id: string
	Name: string
	Options: DFICustomStatOption[]
}

export declare type DFRollableStat =
	| DFStat
	| DFICustomStat['$id']
	| DFPlayerConditionMeter
	| DFIConditionMeter['$id']

export declare interface DFIMoveReroll {
	/**
	 * The markdown string describing the conditions of the reroll. It should be presented to the user so that they can decide whether a reroll is appropriate.
	 * @markdown
	 */
	Text?: string
	/**
	 * The dice to be rerolled.
	 */
	Dice: RerollType
}

export declare interface DFIMoveTriggerOptionBase {
	/**
	 * @pattern ^(Starforged|Ironsworn)/(Moves/[A-z_-]+/[A-z_-]+|Assets/[A-z_-]+/[A-z_-]+/Abilities/[1-3]/Alter_Moves/[0-9]+|Moves/Assets/[A-z_-]+/[A-z_-]+/Abilities/[1-3]/[A-z_-]+)/Trigger/Options/[0-9]+$
	 */
	$id: string
	Text?: string
	/**
	 * Whether this option is an action roll or progress roll.
	 */
	'Roll type': DFRollType
	/**
	 * The method used to choose the stat or track in the `Using` array.
	 */
	Method: DFRollMethod
	/**
	 * The stat(s) or progress track(s) that may be rolled with this move trigger option.
	 */
	Using: (DFRollableStat | DFProgressTypeStarforged | DFProgressTypeIronsworn)[]
	/**
	 * Defines a custom stat, if one is included in this object's `With` array.
	 */
	'Custom stat'?: DFICustomStat | undefined
}

export declare interface DFIMoveTriggerOptionAction
	extends DFIMoveTriggerOptionBase {
	'Roll type': DFRollType.Action
	Using: DFRollableStat[]
}

export declare interface DFIMoveTriggerOptionProgress
	extends DFIMoveTriggerOptionBase {
	'Roll type': DFRollType.Progress
	Using: (DFProgressTypeStarforged | DFProgressTypeIronsworn)[]
}

export declare interface DFIOutcomeInfo {
	/**
	 * @pattern ^(Starforged|Ironsworn)/(Moves/[A-z_-]+/[A-z_-]+|Assets/[A-z_-]+/[A-z_-]+/Abilities/[1-3]/Alter_Moves/[0-9]+|Moves/Assets/[A-z_-]+/[A-z_-]+/Abilities/[1-3]/[A-z_-]+)/Outcomes/((Miss|Strong_Hit)(/With_a_Match)?|Weak_Hit)$
	 */
	$id: string
	Text: string
	/**
	 * Defines a different outcome for this result with a match. Its text should replace the text of this object.
	 */
	'With a Match'?: DFIOutcomeInfo | undefined
	/**
	 * Count this roll as another roll outcome, e.g. "Count a weak hit as a miss"
	 */
	'Count as'?: keyof typeof DFMoveOutcome | undefined
	/**
	 * Information on rerolls offered by this move.
	 */
	Reroll?: IMoveReroll | undefined
	/**
	 * Whether this outcome leaves the player character in control or not. If unspecified, assume that it's `true` on a Strong Hit, and `false` on a Weak Hit or Miss.
	 */
	'In Control'?: boolean | undefined
}
