/**
 * @public
 */
export declare type DFDelveCardType = 'Theme' | 'Domain'

/**
* Describes an attribute key/value pair, set by an oracle row. The key-value pair should be set on any game object for which that row is generated.
*
* Attributes exist to describe prerequisites that might be fulfilled by more than one table, that don't exist on tables at all, or that a generated game object might want to 'force' as one of it's roll results.
*
* See documentation for a list of available values.
* @public
* @see {@link AttributeKey}, {@link Atmosphere}, {@link Authority}, {@link Behavior}, {@link CreatureScale}, {@link DerelictType}, {@link Disposition}, {@link Dominion}, {@link Environment}, {@link FactionType}, {@link FringeGroup}, {@link Guild}, {@link Influence}, {@link Leadership}, {@link Life}, {@link Location}, {@link LocationTheme}, {@link PlanetaryClass}, {@link Population}, {@link Region}, {@link Role}, {@link SettlementInitialContact}, {@link StarshipInitialContact}, {@link Zone}

*/

/**
 * Interface for items with rendering information.
 * @public
 */
export declare interface DFIHasDisplay {
	/**
	 * Data relevant to this item's display/rendering.
	 */
	Display: DFIDisplay
}

/**
 * Interface for items that have associated game objects.
 * @public
 */
export declare interface DFIHasGameObjects {
	/**
	 * Any game objects that are explicitly pointed to by the original text. For most implementations, it is *not* recommended to generate them automatically - see "Peeling the Onion", p. 293.
	 */
	'Game objects': DFIGameObject[]
}

/**
 * Interface for items with a Name key.
 * @public
 */
export declare interface DFDFIHasName {
	/**
	 * The item's internal name. Should be unique among its sibling elements, as this key is often used (along with the object's ancestors) to generate its $id.
	 *
	 * If the item has Display.Title, that should be preferred for most user-facing labels.
	 */
	Name: string
}

/**
 * @public
 */
export declare interface DFIHasOptional {
	/**
	 * Whether or not the source material presents this rules item as optional.
	 * @default false
	 */
	Optional: boolean
}

/**
 * Interface for items with metadata that describes an oracle's semantic or lexical content.
 * @public
 */
export declare interface DFIHasOracleContent {
	/**
	 * Metadata that describes an oracle's semantic or lexical content.
	 */
	Content: DFIOracleContent
}

/**
 * Interface for items that include roll string templates.
 * @public
 */
export declare interface DFIHasRollTemplate {
	/**
	 * Describes the string values of this item that should be replaced with template strings and filled with the results of one or more oracle rolls.
	 */
	'Roll template': DFIRollTemplate
}

/**
 * Interface for items with sourcing information.
 * @public
 */
export declare interface DFIHasSource {
	/**
	 * Information on this item's source.
	 */
	Source: DFISource
}

/**
 * Interface for items that include "non-canonical" suggestions of related items.
 * @public
 */
export declare interface DFIHasSuggestions {
	/**
	 * "Non-canonical" suggestions of related items. They might be convenient to present to the user, but in most implementations rolling them automatically is not recommended.
	 */
	Suggestions: DFISuggestions
}

/**
 * Interface for items that reproduce Starforged rules text in markdown.
 * @public
 */
export declare interface DFIHasText {
	/**
	 * The item's rules text as a markdown string.
	 * @markdown
	 */
	Text: string
}

/**
 * Interface representing a Starforged move.
 * @public
 */
export declare interface DFIMove
	extends DFIHasId,
		DFIHasName,
		DFIHasText,
		DFIHasDisplay,
		DFIHasSource,
		DFIHasOptional,
		Partial<DFIHasSuggestions> {
	/**
	 * @example "Starforged/Moves/Adventure/Face_Danger"
	 * @pattern ^(Starforged|Ironsworn)/Moves/([A-z_-]+|Assets/[A-z_-]+/[A-z_-]+/Abilities/[1-3])/[A-z_-]+$
	 */
	$id: string
	/**
	 * @example "Face Danger"
	 */
	Name: string
	/**
	 * The ID of the parent Asset of the move, if any.
	 */
	Asset?: DFIAsset['$id'] | undefined
	/**
	 * The ID of the move's category.
	 * @example "Starforged/Moves/Adventure"
	 */
	Category: DFIMoveCategory['$id']
	/**
	 * Whether or not the move is a Progress Move. Progress moves roll two challenge dice against a progress score.
	 */
	'Progress Move'?: boolean | undefined
	/**
	 * The ID of the move that this move is a variant of, if any.
	 */
	'Variant of'?: DFIMove['$id'] | undefined
	/**
	 * The move's trigger data.
	 */
	Trigger: DFIMoveTrigger
	/**
	 * The IDs of any oracles directly referenced by the move, or vice versa.
	 */
	Oracles?: DFIOracle['$id'][] | undefined
	/**
	 * Outcome information for the move.
	 */
	Outcomes?: DFIMoveOutcomes | undefined
	Display: DFIDisplayWithTitle
	Tags?: string[] | undefined
}

/**
 * Describes the trigger conditions of the move.
 * @public
 */
export declare interface DFIMoveTrigger extends DFIHasId, Partial<DFIHasText> {
	/**
	 * @pattern ^(Starforged|Ironsworn)/(Moves/[A-z_-]+/[A-z_-]+|Assets/[A-z_-]+/[A-z_-]+/Abilities/[1-3]/Alter_Moves/[0-9]+|Moves/Assets/[A-z_-]+/[A-z_-]+/Abilities/[1-3]/[A-z_-]+)/Trigger$
	 */
	$id: string
	/**
	 * A markdown string containing the primary trigger text for this move.
	 *
	 * Secondary triggers (for specific stats or uses of an asset ability) are described in `Options`.
	 *
	 * @markdown
	 * @example "When you attempt something risky or react to an imminent threat..."
	 */
	Text?: string | undefined
	/**
	 * Information on who can trigger this item. Used mainly by asset abilities, some of which can trigger from an Ally's move.
	 *
	 * If unspecified, assume `Ally` is `false` and `Player` is `true`.
	 */
	By?: DFIMoveTriggerBy | undefined
	/**
	 * Information on any action rolls or progress rolls that are made when this move is triggered (which may describe a specific subset of the primary trigger in their own `Text` property).
	 *
	 * If there's no action rolls or progress rolls attached to this move, this is `undefined`.
	 */
	Options?:
		| (DFIMoveTriggerOptionAction | DFIMoveTriggerOptionProgress)[]
		| undefined
}

/**
 * @public
 */
export declare interface DFIMoveTriggerOptionAction
	extends DFIMoveTriggerOptionBase {
	'Roll type': DFRollType.Action
	Using: DFRollableStat[]
}

/**
 * @public
 */
export declare interface DFIMoveTriggerOptionBase
	extends DFIHasId,
		Partial<DFIHasText> {
	/**
	 * @pattern ^(Starforged|Ironsworn)/(Moves/[A-z_-]+/[A-z_-]+|Assets/[A-z_-]+/[A-z_-]+/Abilities/[1-3]/Alter_Moves/[0-9]+|Moves/Assets/[A-z_-]+/[A-z_-]+/Abilities/[1-3]/[A-z_-]+)/Trigger/Options/[0-9]+$
	 */
	$id: string
	/**
	 * Whether this option is an action roll or progress roll.
	 */
	'Roll type': DFRollType
	/**
	 * The method used to choose the stat or track in the `Using` array.
	 */
	Method: RollMethod
	/**
	 * The stat(s) or progress track(s) that may be rolled with this move trigger option.
	 */
	Using: (DFRollableStat | DFProgressTypeStarforged | DFProgressTypeIronsworn)[]
	/**
	 * Defines a custom stat, if one is included in this object's `With` array.
	 */
	'Custom stat'?: ICustomStat | undefined
}

/**
 * @public
 */
export declare interface DFIMoveTriggerOptionProgress
	extends DFIMoveTriggerOptionBase {
	'Roll type': DFRollType.Progress
	Using: (DFProgressTypeStarforged | DFProgressTypeIronsworn)[]
}

/**
 * Represents an oracle, which may have a Table or multiple child Oracles.
 *
 * If you're looking for a way to crawl the oracle hierarchy in search of a specific ID, see {@link DFIOracleBase}.
 *
 * @public
 */
export declare interface DFIOracle extends DFIOracleBase {
	/**
	 * @pattern ^(Ironsworn|Starforged)/Oracles/[A-z_-]+((/[A-z_-]+)+)?$
	 */
	$id: string
	Display: DFIDisplayOracle
	Category: DFIOracleCategory['$id']
	'Member of'?: DFIOracle['$id'] | undefined
	Table?: DFIRow[] | undefined

	/**
	 * Describes the match behaviour of this oracle's table, if any, and provides a `Text` string describing it. Only appears on a handful of move oracles like Ask the Oracle and Advance a Threat.
	 */
	'On a Match'?: DFIOracleMatch | undefined
}

/**
 * Interface with elements common to various Oracle-related interfaces and classes.
 *
 * If you're trying to crawl the tree for a specific ID, I'd recommend using some flavour of JSONpath (I like `jsonpath-plus`) - it's purpose-made for this sort of nested data structure.
 *
 * But if for some reason you can't, you can use this interface to type both {@link DFIOracle} and {@link DFIOracleCategory} as you recurse the oracle hierarchy. Objects with `Categories` and `Oracles` are "branches", and objects with `Table` are "leaves".
 * @public
 */
export declare interface DFIOracleBase
	extends Partial<DFIHasAliases & DFIHasDescription & DFIHasOracleContent>,
		DFIHasId,
		DFIHasDisplay,
		DFIHasSource,
		DFIHasName {
	/**
	 * The ID of the most recent OracleCategory ancestor of this item, if any.
	 * @pattern ^(Ironsworn|Starforged)/Oracles/[A-z_-/]+$
	 */
	Category?: DFIOracleCategory['$id'] | undefined
	/**
	 * The ID of the most recent Oracle ancestor of this item, if any.
	 * @pattern ^(Ironsworn|Starforged)/Oracles/[A-z_-]+/[A-z_-]+$
	 */
	'Member of'?: DFIOracle['$id'] | undefined
	Display: DFIDisplayWithTitle
	/**
	 * Information on the usage of this oracle: recommended number of rolls, etc.
	 */
	Usage?: DFIOracleUsage | undefined
	/**
	 * Represents a single oracle table, where 'table' is defined as being something with a single roll range.
	 *
	 * This key appears only on 'leaf' nodes of the oracle hierarchy 'tree' - in other words, many (but not all) {@link DFIOracle} objects.
	 */
	Table?: DFIRow[] | undefined
	/**
	 * Oracle objects contained by this object.
	 *
	 * This key appears only on 'branch' nodes of the oracle hierarchy 'tree': {@link DFIOracleCategory}, and {@link DFIOracle} (when it contains multiple closely-related tables).
	 */
	Oracles?: DFIOracle[] | undefined
	/**
	 * Subcategories contained by this oracle category.
	 *
	 * This key appears only on {@link DFIOracleCategory}, and thus only on 'branch' nodes of the oracle hierarchy 'tree.
	 */
	Categories?: DFIOracleCategory[] | undefined
	/**
	 * Describes the match behaviour of this oracle's table, if any, and provides a `Text` string describing it. Only appears on a handful of move oracles like Ask the Oracle and Advance a Threat.
	 *
	 * This key appears only on {@link DFIOracle}s that have a `Table`.
	 */
	'On a Match'?: DFIOracleMatch | undefined
}

/**
 * @public
 */
export declare interface DFIOutcomeInfo extends DFIHasId, DFIHasText {
	/**
	 * @pattern ^(Starforged|Ironsworn)/(Moves/[A-z_-]+/[A-z_-]+|Assets/[A-z_-]+/[A-z_-]+/Abilities/[1-3]/Alter_Moves/[0-9]+|Moves/Assets/[A-z_-]+/[A-z_-]+/Abilities/[1-3]/[A-z_-]+)/Outcomes/((Miss|Strong_Hit)(/With_a_Match)?|Weak_Hit)$
	 */
	$id: string
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
	Reroll?: DFIMoveReroll | undefined
	/**
	 * Whether this outcome leaves the player character in control or not. If unspecified, assume that it's `true` on a Strong Hit, and `false` on a Weak Hit or Miss.
	 */
	'In Control'?: boolean | undefined
}

/**
 * Interface representing a single row in an oracle table.
 * @public
 */
export declare interface DFIRow
	extends Partial<
		DFNullable<DFIHasSummary> &
			DFIHasRollTemplate &
			DFIHasSuggestions &
			DFIHasOracleContent &
			DFIHasGameObjects &
			DFIHasDisplay
	> {
	/**
	 * The ID of this row.
	 * @pattern ^(Ironsworn|Starforged)/Oracles(/[A-z_-]+)+/[1-9][0-9]*(-[1-9][0-9]*)?(/Subtable/[1-9][0-9]*(-[1-9][0-9]*)?)?$
	 * @nullable
	 */
	$id?: string | null
	/**
	 * The low end of the dice range for this row.
	 * @minimum 1
	 * @maximum 100
	 * @nullable
	 */
	Floor: number | null
	/**
	 * The high end of the dice range for this row.
	 * @minimum 1
	 * @maximum 100
	 * @nullable
	 */
	Ceiling: number | null
	/**
	 * The primary result text for the row, annotated in Markdown.
	 * In the book, this is frequently the only column aside from the roll column. Otherwise, it is the first column.
	 * Some tables label this column as something other than Result; see the parent (or grandparent) Oracle.Display for more information.
	 */
	Result: string
	/**
	 * A secondary markdown string that must be presented to the user for the implementation to be complete, but may benefit from progressive disclosure (such as a collapsible element, popover/tooltip, etc).
	 *
	 * Generally, `Summary` is longer than `Result`.
	 *
	 * Some tables label this column as something other than `Result`; see the parent (or grandparent) `DFIOracle.Display.Table` for more information.
	 *
	 * `null` is used in cases where an 'empty' `Summary` exists (example: Starship Type, p. 326). In the book, these table cells are rendered with the text `--` (and this is the recommended placeholder for tabular display). For display as a single result (e.g. VTT table roll output), however, `null` values can be safely omitted.
	 * @nullable
	 */
	Summary?: string | null | undefined
	/**
	 * Additional oracle tables that should be rolled when this row is selected.
	 */
	'Oracle rolls'?: DFIOracle['$id'][] | undefined
	/**
	 * A table to be rolled when this row is selected. If this row references an external oracle, the `Oracles` property is used instead.
	 */
	Subtable?: DFIRow[] | undefined
	/**
	 * Data for rows that call for multiple rolls, e.g. on `Roll twice` results.
	 */
	'Multiple rolls'?: DFIMultipleRolls | undefined
	/**
	 * The attributes set by this row.
	 */
	Attributes?: IAttribute[] | undefined
}

/**
 * Interface for 'canonical' options within a SettingTruth category.
 * @see {@link DFISettingTruth}
 * @public
 */
export declare interface DFISettingTruthOption
	extends DFIRow,
		DFIHasQuestStarter,
		DFIHasDescription {
	/**
	 * @pattern ^(Starforged|Ironsworn)/Setting_Truths/[A-z_-]+/(1-33|34-67|68-100|[1-3])$
	 */
	$id: string
	'Roll template'?: DFIRollTemplate | undefined
	Subtable?: DFIRow[] | undefined
}

/**
 * Interface representing data on this item's source. For 'canonical' content, this is usually a book with numbered pages, but it might also be a link to a web site.
 * @public
 */
export declare interface DFISource {
	/**
	 * The title of the source.
	 *
	 * For 'canonical' content, use one of the enumerated `DFSourceTitle` strings.
	 *
	 * For 3rd-party content (including homebrew) that's been released as part of a titled document, use the title of that document (e.g. "Steelforged", "Ironsmith").
	 *
	 * If the source has no particular title (for instance, it's a single custom element in a VTT implementation), use "Custom".
	 */
	Title: DFSourceTitle | string
	/**
	 * The author(s) of this item. For 'canonical' content, this one's usually pretty obvious 😉 However, it's included so that homebrew content can use the same interface/schema.
	 * @default ["Shawn Tomkin"]
	 */
	Authors: string[]
	/**
	 * The 6-number date string formatted as `MMDDYY`. Relevant only during Starforged development; it will be deprecated once the game is released.
	 * @pattern ^(0[1-9]|1[0-2])([0-2][1-9]|3[0-1])([0-9][0-9])$
	 */
	Date?: string | undefined
	/**
	 * The page on which the item appears most prominently in the source material (if it's in a format that uses page numbers).
	 */
	Page?: number | undefined
	/**
	 * The URL where the source material is available.
	 * @pattern ^https?://.*$
	 */
	Url?: string | undefined
}

/**
 * @public
 */
export declare type DFKeysMatching<T, V> = {
	[K in keyof T]-?: T[K] extends V ? K : never
}[keyof T]

/**
 * @public
 */
export declare type DFKeysWithValuesOfType<T, V> = keyof {
	[P in keyof Required<T> as Required<T>[P] extends V ? P : never]: P
}

/**
 * @public
 */
export declare type DFNullable<T> = {
	[P in keyof T]: T[P] | null
}

/**
 * @public
 */
export declare type DFNullableKey<T, K> = {
	[P in keyof T]: P extends K ? T[P] | null : T[P]
}

/**
 * @public
 */
export declare type DFOmitNever<T> = {
	[K in keyof T as T[K] extends never ? never : K]: T[K]
}

/**
 * @public
 */
export declare type DFOptionalKeys<T> = {
	[K in keyof T]-?: Record<string, unknown> extends Pick<T, K> ? K : never
}[keyof T]

/**
 * Makes a type where K is nullable.
 * @public
 */
export declare type DFPartialBy<T, K extends keyof any = ''> = Omit<T, K> &
	Partial<Pick<T, K extends keyof T ? K : never>>

/**
 * Only recurses a couple times so it doesn't cause an infinite loop during schema generation.
 * @public
 */
export declare type DFPartialDeep<T> = Partial<{
	[P in keyof T]: T[P] extends Array<unknown> ? T[P] | undefined : Partial<T[P]>
}>

/**
 * Makes a type where K and its properties are nullable.
 * @public
 */
export declare type DFPartialDeepBy<T, K extends keyof any = ''> = Omit<T, K> &
	DFPartialDeep<Pick<T, K extends keyof T ? K : never>>

/**
 * Make all properties of T nullable except for K, which is required.
 * @public
 */
export declare type DFPartialExcept<T, K extends keyof any = ''> = RequireKey<
	{
		[P in keyof T]?: T[P]
	},
	K
>

/**
 * @public
 */
export declare enum DFProgressTypeIronsworn {
	Combat = 'Combat',
	Vow = 'Vow',
	Journey = 'Journey',
	Delve = 'Delve',
	SceneChallenge = 'Scene Challenge',
	Bonds = 'Bonds'
}

/**
 * @public
 */
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

/**
 * @public
 */
export declare type DFRequiredKeys<T> = {
	[K in keyof T]-?: Record<string, unknown> extends Pick<T, K> ? never : K
}[keyof T]

/**
 * Generic type: require specific keys to be NonNullable.
 * @public
 */
export declare type DFRequireKey<T, K extends keyof any = ''> = T & {
	[P in K]-?: NonNullable<T[P extends keyof T ? P : never]>
}

/**
 * Standard player character stats or condition meters that can be used as +stat in an action roll.
 * @public
 */
export declare type DFRollableStat =
	| Stat
	| ICustomStat['$id']
	| PlayerConditionMeter
	| IConditionMeter['$id']

/**
 * The stat(s) or progress track(s) that may be rolled with the parent move trigger option.
 * @public
 */
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

/**
 * @public
 */
export declare enum DFRollType {
	Action = 'Action roll',
	Progress = 'Progress roll'
}

/**
 * Make a stub of T where PartialKey is nullable, OmitK is omitted, and all other keys are required.
 *
 * @public
 */
export declare type DFStubBy<
	T,
	PartialKey extends keyof any = '',
	OmitKey extends keyof any = ''
> = Omit<PartialBy<T, PartialKey>, OmitKey>

/**
 * Make a stub of T where ReqK is required, OmitK is omitted, and all other keys are optional.
 * @public
 */
export declare type DFStubExcept<
	T,
	ReqKey extends keyof any = '',
	OmitKey extends keyof any = ''
> = Omit<PartialExcept<T, ReqKey>, OmitKey>

/**
 * Represents a tuple: a typed array with a fixed length.
 * @public
 */
export declare type DFTuple<TItem, TLength extends number> = [
	TItem,
	...TItem[]
] & {
	length: TLength
}
