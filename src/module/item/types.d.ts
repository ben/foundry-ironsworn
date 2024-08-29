/**
 * @public
 */
export declare enum DFAssetTypeName {
	CommandVehicle = 'Command Vehicle',
	Companion = 'Companion',
	Deed = 'Deed',
	Module = 'Module',
	Path = 'Path',
	SupportVehicle = 'Support Vehicle'
}

/**
 * @public
 */
export declare enum DFAttributeKey {
	/**
	 * {@link Atmosphere}
	 */
	Atmosphere = 'Atmosphere',
	/**
	 * {@link Authority}
	 */
	Authority = 'Authority',
	/**
	 * {@link Behavior}
	 */
	Behavior = 'Encountered Behavior',
	/**
	 * {@link DerelictType}
	 */
	DerelictType = 'Derelict Type',
	/**
	 * {@link Disposition}
	 */
	Disposition = 'Disposition',
	/**
	 * {@link Dominion}
	 */
	Dominion = 'Dominion',
	/**
	 * {@link Environment}
	 */
	Environment = 'Environment',
	/**
	 * {@link FactionType}
	 */
	FactionType = 'Faction Type',
	/**
	 * {@link FringeGroup}
	 */
	FringeGroup = 'Fringe Group',
	/**
	 * {@link Guild}
	 */
	Guild = 'Guild',
	/**
	 * {@link Influence}
	 */
	Influence = 'Influence',
	/**
	 * {@link StarshipInitialContact} {@link SettlementInitialContact}
	 */
	InitialContact = 'Initial Contact',
	/**
	 * {@link Leadership}
	 */
	Leadership = 'Leadership',
	/**
	 * {@link Life}
	 */
	Life = 'Life',
	/**
	 * {@link Location}
	 */
	Location = 'Location',
	/**
	 * {@link LocationTheme}
	 */
	LocationTheme = 'Location Theme',
	/**
	 * {@link PlanetaryClass}
	 */
	PlanetaryClass = 'Planetary Class',
	/**
	 * {@link Population}
	 */
	Population = 'Population',
	/**
	 * {@link Region}
	 */
	Region = 'Region',
	/**
	 * {@link Role}
	 */
	Role = 'Role',
	/**
	 * {@link CreatureScale}
	 */
	CreatureScale = 'Creature Scale',
	/**
	 * {@link Zone}
	 */
	Zone = 'Zone'
}

/**
 * Enumerates challenge ranks.
 * @page 39
 * @public
 */
export declare enum DFChallengeRank {
	Troublesome = 1,
	Dangerous = 2,
	Formidable = 3,
	Extreme = 4,
	Epic = 5
}

/**
 * @public
 */
export declare enum DFClockSegments {
	Four = 4,
	Six = 6,
	Eight = 8,
	Ten = 10
}

/**
 * See clocks (p. 234) for more information.
 * @public
 */
export declare enum DFClockType {
	Tension = 'Tension',
	Campaign = 'Campaign'
}

/**
 * @public
 */
export declare type DFDelveCardType = 'Theme' | 'Domain'

/**
 * @public
 */
export declare enum DFEncounterNatureIronsworn {
	Ironlander = 'Ironlander',
	Firstborn = 'Firstborn',
	Animal = 'Animal',
	Beast = 'Beast',
	Horror = 'Horror',
	Anomaly = 'Anomaly'
}

/**
 * @public
 */
export declare enum DFEncounterNatureStarforged {
	Creature = 'Creature',
	Horror = 'Horror',
	Human = 'Human',
	Machine = 'Machine',
	Monster = 'Monster'
}

/**
 * @public
 */
export declare enum DFEncounterTags {
	Vehicle = 'vehicle'
}

/**
 * @public
 */
export declare enum DFGameObjectType {
	Derelict = 'Derelict',
	DerelictZone = 'Derelict Zone',
	Starship = 'Starship',
	Settlement = 'Settlement',
	Planet = 'Planet',
	PrecursorVault = 'Precursor Vault',
	Character = 'Character',
	Creature = 'Creature',
	Faction = 'Faction'
}

/**
 * Some might say that "Gamespace" is a terrible pun. To them, I reply: you'll never take me alive.
 * @public
 */
export declare enum DFGamespace {
	Starforged = 'Starforged',
	Ironsworn = 'Ironsworn'
}

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
 * The type of an attribute set by a Select Input.
 * @public
 */
export declare enum DFInputSelectOptionType {
	/**
	 * A reference to one of the player character's stats: Edge, Heart, Iron, Shadow, or Wits.
	 * @see {@link Stat}
	 */
	Stat = 'Stat',
	/**
	 * A reference to one of the player character's condition meters: Health, Spirit, or Supply.
	 * @see {@link PlayerConditionMeter}
	 */
	ConditionMeter = 'Condition Meter',
	/**
	 * An arbitrary pre-set string value.
	 */
	String = 'String',
	/**
	 * A arbitrary pre-set number value.
	 */
	Number = 'Number'
}

/**
 * @public
 */
export declare enum DFInputType {
	/**
	 * @see {@link IInputText}
	 */
	Text = 'Text',
	/**
	 * @see {@link IInputSelect}
	 */
	Select = 'Select',
	/**
	 * @see {@link IInputNumber}
	 */
	Number = 'Number',
	/**
	 * @see {@link IInputClock}
	 */
	Clock = 'Clock'
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
 * Set by Oracles / Location Themes / Theme Type
 * @public
 */
export declare enum DFLocationTheme {
	Chaotic = 'Chaotic',
	Fortified = 'Fortified',
	Haunted = 'Haunted',
	Infested = 'Infested',
	Inhabited = 'Inhabited',
	Mechanical = 'Mechanical',
	Ruined = 'Ruined',
	Sacred = 'Sacred'
}

/**
 * Names of non-player condition meters (for e.g. companions and vehicles) that are referenced by moves and other assets.
 * If an asset condition meter can be used in this manner, the alias is included in its Aliases array.
 * @public
 */
export declare enum DFMeterAlias {
	CompanionHealth = 'Companion Health',
	VehicleIntegrity = 'Vehicle Integrity',
	CommandVehicleIntegrity = 'Command Vehicle Integrity',
	SupportVehicleIntegrity = 'Support Vehicle Integrity',
	IncidentalVehicleIntegrity = 'Incidental Vehicle Integrity'
}

/**
 * Conditions (such as impacts) that can apply to asset cards with condition meters. These are typically presented as tick boxes on the asset card.
 * @public
 */
export declare enum DFMeterCondition {
	/**
	 * Battered may be marked when your vehicle is at 0 integrity and you fail to Withstand Damage. The vehicle is barely holding together.
	 * @page 51
	 */
	Battered = 'Battered',
	/**
	 * Cursed may be marked when your command vehicle (STARSHIP asset) is at 0 integrity and you fail to Withstand Damage. This is a permanent impact. Your ship will never be quite right again.
	 * @page 51
	 */
	Cursed = 'Cursed',
	/**
	 * When your companion’s health is at 0 and you score a miss, they are out of action. You cannot leverage their support until they gain at least +1 health. Envision what this means in the fiction of your scene.
	 * @page 204
	 */
	OutOfAction = 'Out of Action',
	/** Used by "Fleet Commander" asset */
	Wrecked = 'Wrecked'
}

/**
 * Enumerates player character resource meters.
 * @public
 */
export declare enum DFMeterType {
	Health = 'Health',
	Spirit = 'Spirit',
	Supply = 'Supply',
	Momentum = 'Momentum'
}

/**
 * "Assets" is also valid, technically, but it's only used in IDs, so it's omitted here.
 * @public
 */
export declare enum DFMoveCategoryName {
	Session = 'Session',
	Adventure = 'Adventure',
	Quest = 'Quest',
	Connection = 'Connection',
	Exploration = 'Exploration',
	Combat = 'Combat',
	Suffer = 'Suffer',
	Recover = 'Recover',
	Threshold = 'Threshold',
	Legacy = 'Legacy',
	Fate = 'Fate'
}

/**
 * @public
 */
export declare enum DFMoveOutcome {
	Miss = 0,
	'Weak Hit' = 1,
	'Strong Hit' = 2
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
export declare enum DFPartOfSpeechTag {
	Noun = 'noun',
	CommonNoun = 'common noun',
	Fragment = 'fragment',
	Adjective = 'adjective',
	ProperNoun = 'proper noun',
	Verb = 'verb',
	Plural = 'plural',
	Name = 'name',
	ProperNounFragment = 'proper noun fragment',
	Sentences = 'sentences',
	CompoundNoun = 'compound noun',
	PossessiveCase = 'possessive case'
}

/**
 * Set by "Oracles / Planets / Class"
 * @public
 */
export declare enum DFPlanetaryClass {
	Desert = 'Desert',
	Furnace = 'Furnace',
	Grave = 'Grave',
	Ice = 'Ice',
	Jovian = 'Jovian',
	Jungle = 'Jungle',
	Ocean = 'Ocean',
	Rocky = 'Rocky',
	Shattered = 'Shattered',
	Tainted = 'Tainted',
	Vital = 'Vital'
}

/**
 * Standard player character condition meters.
 * @public
 */
export declare enum DFPlayerConditionMeter {
	Health = 'Health',
	Spirit = 'Spirit',
	Supply = 'Supply'
}

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
 * Standard replacement strings, used by constructors when processing the master YAML data.
 * @public
 */
export declare enum DFReplacement {
	/**
	 * Replace with the ID of the nearest ancestor asset.
	 */
	Asset = '${{@ASSET}}',
	/**
	 * Replace with the ID of the nearest ancestor asset's condition meter.
	 */
	AssetMeter = '${{@ASSET_METER}}',
	/**
	 * Replace with the ID of the nearest ancestor move trigger's custom stat.
	 */
	CustomStat = '${{@CUSTOM_STAT}}',
	/**
	 * Replace with the ID of the nearest select option value of the Stat type
	 */
	AssetSelectStat = '${{@ASSET_SELECT_STAT}}',
	/**
	 * Replace with the ID of the nearest select option value of the ConditionMeter type.
	 */
	AssetSelectMeter = '${{@ASSET_SELECT_METER}}'
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
 * Enumerates which dice are to be rerolled.
 * @public
 */
export declare enum DFRerollType {
	/**
	 * The player can pick and choose which dice to reroll.
	 */
	Any = 'Any',
	/**
	 * The player can pick and choose which challenge dice to reroll.
	 */
	ChallengeDice = 'Challenge dice',
	/**
	 * The action die is rerolled.
	 */
	ActionDie = 'Action die',
	/**
	 * The player can choose one challenge die to reroll.
	 */
	ChallengeDie = 'Challenge die',
	/**
	 * Reroll *all* dice
	 */
	All = 'All'
}

/**
 * Enumerates the ID of every 'canonical' Starforged oracle that can be rolled directly. Provided to make it easy to type-check e.g. functions that accept an oracle ID as an argument.
 * @public
 */
export declare enum DFRollableOraclesSF {
	Character_Creation_Background_Assets = 'Starforged/Oracles/Character_Creation/Background_Assets',
	Character_Creation_Backstory_Prompts = 'Starforged/Oracles/Character_Creation/Backstory_Prompts',
	Character_Creation_Inciting_Incident = 'Starforged/Oracles/Character_Creation/Inciting_Incident',
	Character_Creation_Sector_Trouble = 'Starforged/Oracles/Character_Creation/Sector_Trouble',
	Character_Creation_Starship_History = 'Starforged/Oracles/Character_Creation/Starship_History',
	Character_Creation_Starship_Quirks = 'Starforged/Oracles/Character_Creation/Starship_Quirks',
	Characters_Disposition = 'Starforged/Oracles/Characters/Disposition',
	Characters_First_Look = 'Starforged/Oracles/Characters/First_Look',
	Characters_Goal = 'Starforged/Oracles/Characters/Goal',
	Characters_Name_Callsign = 'Starforged/Oracles/Characters/Name/Callsign',
	Characters_Name_Family_Name = 'Starforged/Oracles/Characters/Name/Family_Name',
	Characters_Name_Given_Name = 'Starforged/Oracles/Characters/Name/Given_Name',
	Characters_Revealed_Aspect = 'Starforged/Oracles/Characters/Revealed_Aspect',
	Characters_Role = 'Starforged/Oracles/Characters/Role',
	Core_Action = 'Starforged/Oracles/Core/Action',
	Core_Descriptor = 'Starforged/Oracles/Core/Descriptor',
	Core_Focus = 'Starforged/Oracles/Core/Focus',
	Core_Theme = 'Starforged/Oracles/Core/Theme',
	Creatures_Basic_Form_Air = 'Starforged/Oracles/Creatures/Basic_Form/Air',
	Creatures_Basic_Form_Interior = 'Starforged/Oracles/Creatures/Basic_Form/Interior',
	Creatures_Basic_Form_Land = 'Starforged/Oracles/Creatures/Basic_Form/Land',
	Creatures_Basic_Form_Liquid = 'Starforged/Oracles/Creatures/Basic_Form/Liquid',
	Creatures_Basic_Form_Space = 'Starforged/Oracles/Creatures/Basic_Form/Space',
	Creatures_Encountered_Behavior = 'Starforged/Oracles/Creatures/Encountered_Behavior',
	Creatures_Environment = 'Starforged/Oracles/Creatures/Environment',
	Creatures_First_Look = 'Starforged/Oracles/Creatures/First_Look',
	Creatures_Revealed_Aspect = 'Starforged/Oracles/Creatures/Revealed_Aspect',
	Creatures_Scale = 'Starforged/Oracles/Creatures/Scale',
	Creatures_Ultra_scale = 'Starforged/Oracles/Creatures/Ultra-scale',
	Derelicts_Access_Area = 'Starforged/Oracles/Derelicts/Access/Area',
	Derelicts_Access_Feature = 'Starforged/Oracles/Derelicts/Access/Feature',
	Derelicts_Access_Opportunity = 'Starforged/Oracles/Derelicts/Access/Opportunity',
	Derelicts_Access_Peril = 'Starforged/Oracles/Derelicts/Access/Peril',
	Derelicts_Community_Area = 'Starforged/Oracles/Derelicts/Community/Area',
	Derelicts_Community_Feature = 'Starforged/Oracles/Derelicts/Community/Feature',
	Derelicts_Community_Opportunity = 'Starforged/Oracles/Derelicts/Community/Opportunity',
	Derelicts_Community_Peril = 'Starforged/Oracles/Derelicts/Community/Peril',
	Derelicts_Condition = 'Starforged/Oracles/Derelicts/Condition',
	Derelicts_Engineering_Area = 'Starforged/Oracles/Derelicts/Engineering/Area',
	Derelicts_Engineering_Feature = 'Starforged/Oracles/Derelicts/Engineering/Feature',
	Derelicts_Engineering_Opportunity = 'Starforged/Oracles/Derelicts/Engineering/Opportunity',
	Derelicts_Engineering_Peril = 'Starforged/Oracles/Derelicts/Engineering/Peril',
	Derelicts_Inner_First_Look = 'Starforged/Oracles/Derelicts/Inner_First_Look',
	Derelicts_Living_Area = 'Starforged/Oracles/Derelicts/Living/Area',
	Derelicts_Living_Feature = 'Starforged/Oracles/Derelicts/Living/Feature',
	Derelicts_Living_Opportunity = 'Starforged/Oracles/Derelicts/Living/Opportunity',
	Derelicts_Living_Peril = 'Starforged/Oracles/Derelicts/Living/Peril',
	Derelicts_Location = 'Starforged/Oracles/Derelicts/Location',
	Derelicts_Medical_Area = 'Starforged/Oracles/Derelicts/Medical/Area',
	Derelicts_Medical_Feature = 'Starforged/Oracles/Derelicts/Medical/Feature',
	Derelicts_Medical_Opportunity = 'Starforged/Oracles/Derelicts/Medical/Opportunity',
	Derelicts_Medical_Peril = 'Starforged/Oracles/Derelicts/Medical/Peril',
	Derelicts_Operations_Area = 'Starforged/Oracles/Derelicts/Operations/Area',
	Derelicts_Operations_Feature = 'Starforged/Oracles/Derelicts/Operations/Feature',
	Derelicts_Operations_Opportunity = 'Starforged/Oracles/Derelicts/Operations/Opportunity',
	Derelicts_Operations_Peril = 'Starforged/Oracles/Derelicts/Operations/Peril',
	Derelicts_Outer_First_Look = 'Starforged/Oracles/Derelicts/Outer_First_Look',
	Derelicts_Production_Area = 'Starforged/Oracles/Derelicts/Production/Area',
	Derelicts_Production_Feature = 'Starforged/Oracles/Derelicts/Production/Feature',
	Derelicts_Production_Opportunity = 'Starforged/Oracles/Derelicts/Production/Opportunity',
	Derelicts_Production_Peril = 'Starforged/Oracles/Derelicts/Production/Peril',
	Derelicts_Research_Area = 'Starforged/Oracles/Derelicts/Research/Area',
	Derelicts_Research_Feature = 'Starforged/Oracles/Derelicts/Research/Feature',
	Derelicts_Research_Opportunity = 'Starforged/Oracles/Derelicts/Research/Opportunity',
	Derelicts_Research_Peril = 'Starforged/Oracles/Derelicts/Research/Peril',
	Derelicts_Type_Deep_Space = 'Starforged/Oracles/Derelicts/Type/Deep_Space',
	Derelicts_Type_Orbital = 'Starforged/Oracles/Derelicts/Type/Orbital',
	Derelicts_Type_Planetside = 'Starforged/Oracles/Derelicts/Type/Planetside',
	Derelicts_Zones_Settlement = 'Starforged/Oracles/Derelicts/Zones/Settlement',
	Derelicts_Zones_Starship = 'Starforged/Oracles/Derelicts/Zones/Starship',
	Factions_Affiliation = 'Starforged/Oracles/Factions/Affiliation',
	Factions_Dominion = 'Starforged/Oracles/Factions/Dominion',
	Factions_Fringe_Group = 'Starforged/Oracles/Factions/Fringe_Group',
	Factions_Guild = 'Starforged/Oracles/Factions/Guild',
	Factions_Identity = 'Starforged/Oracles/Factions/Identity',
	Factions_Influence = 'Starforged/Oracles/Factions/Influence',
	Factions_Leadership = 'Starforged/Oracles/Factions/Leadership',
	Factions_Legacy = 'Starforged/Oracles/Factions/Legacy',
	Factions_Name_Template = 'Starforged/Oracles/Factions/Name_Template',
	Factions_Projects = 'Starforged/Oracles/Factions/Projects',
	Factions_Quirks = 'Starforged/Oracles/Factions/Quirks',
	Factions_Relationships = 'Starforged/Oracles/Factions/Relationships',
	Factions_Rumors = 'Starforged/Oracles/Factions/Rumors',
	Factions_Type = 'Starforged/Oracles/Factions/Type',
	Location_Themes_Chaotic_Feature = 'Starforged/Oracles/Location_Themes/Chaotic/Feature',
	Location_Themes_Chaotic_Opportunity = 'Starforged/Oracles/Location_Themes/Chaotic/Opportunity',
	Location_Themes_Chaotic_Peril = 'Starforged/Oracles/Location_Themes/Chaotic/Peril',
	Location_Themes_Fortified_Feature = 'Starforged/Oracles/Location_Themes/Fortified/Feature',
	Location_Themes_Fortified_Opportunity = 'Starforged/Oracles/Location_Themes/Fortified/Opportunity',
	Location_Themes_Fortified_Peril = 'Starforged/Oracles/Location_Themes/Fortified/Peril',
	Location_Themes_Haunted_Feature = 'Starforged/Oracles/Location_Themes/Haunted/Feature',
	Location_Themes_Haunted_Opportunity = 'Starforged/Oracles/Location_Themes/Haunted/Opportunity',
	Location_Themes_Haunted_Peril = 'Starforged/Oracles/Location_Themes/Haunted/Peril',
	Location_Themes_Infested_Feature = 'Starforged/Oracles/Location_Themes/Infested/Feature',
	Location_Themes_Infested_Opportunity = 'Starforged/Oracles/Location_Themes/Infested/Opportunity',
	Location_Themes_Infested_Peril = 'Starforged/Oracles/Location_Themes/Infested/Peril',
	Location_Themes_Inhabited_Feature = 'Starforged/Oracles/Location_Themes/Inhabited/Feature',
	Location_Themes_Inhabited_Opportunity = 'Starforged/Oracles/Location_Themes/Inhabited/Opportunity',
	Location_Themes_Inhabited_Peril = 'Starforged/Oracles/Location_Themes/Inhabited/Peril',
	Location_Themes_Mechanical_Feature = 'Starforged/Oracles/Location_Themes/Mechanical/Feature',
	Location_Themes_Mechanical_Opportunity = 'Starforged/Oracles/Location_Themes/Mechanical/Opportunity',
	Location_Themes_Mechanical_Peril = 'Starforged/Oracles/Location_Themes/Mechanical/Peril',
	Location_Themes_Ruined_Feature = 'Starforged/Oracles/Location_Themes/Ruined/Feature',
	Location_Themes_Ruined_Opportunity = 'Starforged/Oracles/Location_Themes/Ruined/Opportunity',
	Location_Themes_Ruined_Peril = 'Starforged/Oracles/Location_Themes/Ruined/Peril',
	Location_Themes_Sacred_Feature = 'Starforged/Oracles/Location_Themes/Sacred/Feature',
	Location_Themes_Sacred_Opportunity = 'Starforged/Oracles/Location_Themes/Sacred/Opportunity',
	Location_Themes_Sacred_Peril = 'Starforged/Oracles/Location_Themes/Sacred/Peril',
	Location_Themes_Theme_Type = 'Starforged/Oracles/Location_Themes/Theme_Type',
	Misc_Anomaly_Effect = 'Starforged/Oracles/Misc/Anomaly_Effect',
	Misc_Combat_Action = 'Starforged/Oracles/Misc/Combat_Action',
	Misc_Story_Clue = 'Starforged/Oracles/Misc/Story_Clue',
	Misc_Story_Complication = 'Starforged/Oracles/Misc/Story_Complication',
	Moves_Ask_the_Oracle_Almost_Certain = 'Starforged/Oracles/Moves/Ask_the_Oracle/Almost_Certain',
	Moves_Ask_the_Oracle_Fifty_fifty = 'Starforged/Oracles/Moves/Ask_the_Oracle/Fifty-fifty',
	Moves_Ask_the_Oracle_Likely = 'Starforged/Oracles/Moves/Ask_the_Oracle/Likely',
	Moves_Ask_the_Oracle_Small_Chance = 'Starforged/Oracles/Moves/Ask_the_Oracle/Small_Chance',
	Moves_Ask_the_Oracle_Unlikely = 'Starforged/Oracles/Moves/Ask_the_Oracle/Unlikely',
	Moves_Begin_a_Session = 'Starforged/Oracles/Moves/Begin_a_Session',
	Moves_Confront_Chaos = 'Starforged/Oracles/Moves/Confront_Chaos',
	Moves_Endure_Harm = 'Starforged/Oracles/Moves/Endure_Harm',
	Moves_Endure_Stress = 'Starforged/Oracles/Moves/Endure_Stress',
	Moves_Make_a_Discovery = 'Starforged/Oracles/Moves/Make_a_Discovery',
	Moves_Pay_the_Price = 'Starforged/Oracles/Moves/Pay_the_Price',
	Moves_Take_Decisive_Action = 'Starforged/Oracles/Moves/Take_Decisive_Action',
	Moves_Withstand_Damage = 'Starforged/Oracles/Moves/Withstand_Damage',
	Planets_Class = 'Starforged/Oracles/Planets/Class',
	Planets_Desert_Atmosphere = 'Starforged/Oracles/Planets/Desert/Atmosphere',
	Planets_Desert_Feature = 'Starforged/Oracles/Planets/Desert/Feature',
	Planets_Desert_Life = 'Starforged/Oracles/Planets/Desert/Life',
	Planets_Desert_Observed_From_Space = 'Starforged/Oracles/Planets/Desert/Observed_From_Space',
	Planets_Desert_Settlements_Expanse = 'Starforged/Oracles/Planets/Desert/Settlements/Expanse',
	Planets_Desert_Settlements_Outlands = 'Starforged/Oracles/Planets/Desert/Settlements/Outlands',
	Planets_Desert_Settlements_Terminus = 'Starforged/Oracles/Planets/Desert/Settlements/Terminus',
	Planets_Furnace_Atmosphere = 'Starforged/Oracles/Planets/Furnace/Atmosphere',
	Planets_Furnace_Feature = 'Starforged/Oracles/Planets/Furnace/Feature',
	Planets_Furnace_Life = 'Starforged/Oracles/Planets/Furnace/Life',
	Planets_Furnace_Observed_From_Space = 'Starforged/Oracles/Planets/Furnace/Observed_From_Space',
	Planets_Furnace_Settlements_Expanse = 'Starforged/Oracles/Planets/Furnace/Settlements/Expanse',
	Planets_Furnace_Settlements_Outlands = 'Starforged/Oracles/Planets/Furnace/Settlements/Outlands',
	Planets_Furnace_Settlements_Terminus = 'Starforged/Oracles/Planets/Furnace/Settlements/Terminus',
	Planets_Grave_Atmosphere = 'Starforged/Oracles/Planets/Grave/Atmosphere',
	Planets_Grave_Feature = 'Starforged/Oracles/Planets/Grave/Feature',
	Planets_Grave_Life = 'Starforged/Oracles/Planets/Grave/Life',
	Planets_Grave_Observed_From_Space = 'Starforged/Oracles/Planets/Grave/Observed_From_Space',
	Planets_Grave_Settlements_Expanse = 'Starforged/Oracles/Planets/Grave/Settlements/Expanse',
	Planets_Grave_Settlements_Outlands = 'Starforged/Oracles/Planets/Grave/Settlements/Outlands',
	Planets_Grave_Settlements_Terminus = 'Starforged/Oracles/Planets/Grave/Settlements/Terminus',
	Planets_Ice_Atmosphere = 'Starforged/Oracles/Planets/Ice/Atmosphere',
	Planets_Ice_Feature = 'Starforged/Oracles/Planets/Ice/Feature',
	Planets_Ice_Life = 'Starforged/Oracles/Planets/Ice/Life',
	Planets_Ice_Observed_From_Space = 'Starforged/Oracles/Planets/Ice/Observed_From_Space',
	Planets_Ice_Settlements_Expanse = 'Starforged/Oracles/Planets/Ice/Settlements/Expanse',
	Planets_Ice_Settlements_Outlands = 'Starforged/Oracles/Planets/Ice/Settlements/Outlands',
	Planets_Ice_Settlements_Terminus = 'Starforged/Oracles/Planets/Ice/Settlements/Terminus',
	Planets_Jovian_Atmosphere = 'Starforged/Oracles/Planets/Jovian/Atmosphere',
	Planets_Jovian_Feature = 'Starforged/Oracles/Planets/Jovian/Feature',
	Planets_Jovian_Life = 'Starforged/Oracles/Planets/Jovian/Life',
	Planets_Jovian_Observed_From_Space = 'Starforged/Oracles/Planets/Jovian/Observed_From_Space',
	Planets_Jovian_Settlements_Expanse = 'Starforged/Oracles/Planets/Jovian/Settlements/Expanse',
	Planets_Jovian_Settlements_Outlands = 'Starforged/Oracles/Planets/Jovian/Settlements/Outlands',
	Planets_Jovian_Settlements_Terminus = 'Starforged/Oracles/Planets/Jovian/Settlements/Terminus',
	Planets_Jungle_Atmosphere = 'Starforged/Oracles/Planets/Jungle/Atmosphere',
	Planets_Jungle_Feature = 'Starforged/Oracles/Planets/Jungle/Feature',
	Planets_Jungle_Life = 'Starforged/Oracles/Planets/Jungle/Life',
	Planets_Jungle_Observed_From_Space = 'Starforged/Oracles/Planets/Jungle/Observed_From_Space',
	Planets_Jungle_Settlements_Expanse = 'Starforged/Oracles/Planets/Jungle/Settlements/Expanse',
	Planets_Jungle_Settlements_Outlands = 'Starforged/Oracles/Planets/Jungle/Settlements/Outlands',
	Planets_Jungle_Settlements_Terminus = 'Starforged/Oracles/Planets/Jungle/Settlements/Terminus',
	Planets_Ocean_Atmosphere = 'Starforged/Oracles/Planets/Ocean/Atmosphere',
	Planets_Ocean_Feature = 'Starforged/Oracles/Planets/Ocean/Feature',
	Planets_Ocean_Life = 'Starforged/Oracles/Planets/Ocean/Life',
	Planets_Ocean_Observed_From_Space = 'Starforged/Oracles/Planets/Ocean/Observed_From_Space',
	Planets_Ocean_Settlements_Expanse = 'Starforged/Oracles/Planets/Ocean/Settlements/Expanse',
	Planets_Ocean_Settlements_Outlands = 'Starforged/Oracles/Planets/Ocean/Settlements/Outlands',
	Planets_Ocean_Settlements_Terminus = 'Starforged/Oracles/Planets/Ocean/Settlements/Terminus',
	Planets_Opportunity_Lifebearing = 'Starforged/Oracles/Planets/Opportunity/Lifebearing',
	Planets_Opportunity_Lifeless = 'Starforged/Oracles/Planets/Opportunity/Lifeless',
	Planets_Peril_Lifebearing = 'Starforged/Oracles/Planets/Peril/Lifebearing',
	Planets_Peril_Lifeless = 'Starforged/Oracles/Planets/Peril/Lifeless',
	Planets_Rocky_Atmosphere = 'Starforged/Oracles/Planets/Rocky/Atmosphere',
	Planets_Rocky_Feature = 'Starforged/Oracles/Planets/Rocky/Feature',
	Planets_Rocky_Life = 'Starforged/Oracles/Planets/Rocky/Life',
	Planets_Rocky_Observed_From_Space = 'Starforged/Oracles/Planets/Rocky/Observed_From_Space',
	Planets_Rocky_Settlements_Expanse = 'Starforged/Oracles/Planets/Rocky/Settlements/Expanse',
	Planets_Rocky_Settlements_Outlands = 'Starforged/Oracles/Planets/Rocky/Settlements/Outlands',
	Planets_Rocky_Settlements_Terminus = 'Starforged/Oracles/Planets/Rocky/Settlements/Terminus',
	Planets_Shattered_Atmosphere = 'Starforged/Oracles/Planets/Shattered/Atmosphere',
	Planets_Shattered_Feature = 'Starforged/Oracles/Planets/Shattered/Feature',
	Planets_Shattered_Life = 'Starforged/Oracles/Planets/Shattered/Life',
	Planets_Shattered_Observed_From_Space = 'Starforged/Oracles/Planets/Shattered/Observed_From_Space',
	Planets_Shattered_Settlements_Expanse = 'Starforged/Oracles/Planets/Shattered/Settlements/Expanse',
	Planets_Shattered_Settlements_Outlands = 'Starforged/Oracles/Planets/Shattered/Settlements/Outlands',
	Planets_Shattered_Settlements_Terminus = 'Starforged/Oracles/Planets/Shattered/Settlements/Terminus',
	Planets_Tainted_Atmosphere = 'Starforged/Oracles/Planets/Tainted/Atmosphere',
	Planets_Tainted_Feature = 'Starforged/Oracles/Planets/Tainted/Feature',
	Planets_Tainted_Life = 'Starforged/Oracles/Planets/Tainted/Life',
	Planets_Tainted_Observed_From_Space = 'Starforged/Oracles/Planets/Tainted/Observed_From_Space',
	Planets_Tainted_Settlements_Expanse = 'Starforged/Oracles/Planets/Tainted/Settlements/Expanse',
	Planets_Tainted_Settlements_Outlands = 'Starforged/Oracles/Planets/Tainted/Settlements/Outlands',
	Planets_Tainted_Settlements_Terminus = 'Starforged/Oracles/Planets/Tainted/Settlements/Terminus',
	Planets_Vital_Atmosphere = 'Starforged/Oracles/Planets/Vital/Atmosphere',
	Planets_Vital_Biomes = 'Starforged/Oracles/Planets/Vital/Biomes',
	Planets_Vital_Diversity = 'Starforged/Oracles/Planets/Vital/Diversity',
	Planets_Vital_Feature = 'Starforged/Oracles/Planets/Vital/Feature',
	Planets_Vital_Life = 'Starforged/Oracles/Planets/Vital/Life',
	Planets_Vital_Observed_From_Space = 'Starforged/Oracles/Planets/Vital/Observed_From_Space',
	Planets_Vital_Settlements_Expanse = 'Starforged/Oracles/Planets/Vital/Settlements/Expanse',
	Planets_Vital_Settlements_Outlands = 'Starforged/Oracles/Planets/Vital/Settlements/Outlands',
	Planets_Vital_Settlements_Terminus = 'Starforged/Oracles/Planets/Vital/Settlements/Terminus',
	Settlements_Authority = 'Starforged/Oracles/Settlements/Authority',
	Settlements_First_Look = 'Starforged/Oracles/Settlements/First_Look',
	Settlements_Initial_Contact = 'Starforged/Oracles/Settlements/Initial_Contact',
	Settlements_Location = 'Starforged/Oracles/Settlements/Location',
	Settlements_Name = 'Starforged/Oracles/Settlements/Name',
	Settlements_Population_Expanse = 'Starforged/Oracles/Settlements/Population/Expanse',
	Settlements_Population_Outlands = 'Starforged/Oracles/Settlements/Population/Outlands',
	Settlements_Population_Terminus = 'Starforged/Oracles/Settlements/Population/Terminus',
	Settlements_Projects = 'Starforged/Oracles/Settlements/Projects',
	Settlements_Trouble = 'Starforged/Oracles/Settlements/Trouble',
	Space_Opportunity = 'Starforged/Oracles/Space/Opportunity',
	Space_Peril = 'Starforged/Oracles/Space/Peril',
	Space_Sector_Name_Prefix = 'Starforged/Oracles/Space/Sector_Name/Prefix',
	Space_Sector_Name_Suffix = 'Starforged/Oracles/Space/Sector_Name/Suffix',
	Space_Sighting_Expanse = 'Starforged/Oracles/Space/Sighting/Expanse',
	Space_Sighting_Outlands = 'Starforged/Oracles/Space/Sighting/Outlands',
	Space_Sighting_Terminus = 'Starforged/Oracles/Space/Sighting/Terminus',
	Space_Stellar_Object = 'Starforged/Oracles/Space/Stellar_Object',
	Starships_First_Look = 'Starforged/Oracles/Starships/First_Look',
	Starships_Fleet = 'Starforged/Oracles/Starships/Fleet',
	Starships_Initial_Contact = 'Starforged/Oracles/Starships/Initial_Contact',
	Starships_Mission_Expanse = 'Starforged/Oracles/Starships/Mission/Expanse',
	Starships_Mission_Outlands = 'Starforged/Oracles/Starships/Mission/Outlands',
	Starships_Mission_Terminus = 'Starforged/Oracles/Starships/Mission/Terminus',
	Starships_Name = 'Starforged/Oracles/Starships/Name',
	Starships_Type = 'Starforged/Oracles/Starships/Type',
	Vaults_Form = 'Starforged/Oracles/Vaults/Form',
	Vaults_Interior_Feature = 'Starforged/Oracles/Vaults/Interior/Feature',
	Vaults_Interior_First_Look = 'Starforged/Oracles/Vaults/Interior/First_Look',
	Vaults_Interior_Opportunity = 'Starforged/Oracles/Vaults/Interior/Opportunity',
	Vaults_Interior_Peril = 'Starforged/Oracles/Vaults/Interior/Peril',
	Vaults_Location = 'Starforged/Oracles/Vaults/Location',
	Vaults_Material = 'Starforged/Oracles/Vaults/Material',
	Vaults_Outer_First_Look = 'Starforged/Oracles/Vaults/Outer_First_Look',
	Vaults_Sanctum_Feature = 'Starforged/Oracles/Vaults/Sanctum/Feature',
	Vaults_Sanctum_Opportunity = 'Starforged/Oracles/Vaults/Sanctum/Opportunity',
	Vaults_Sanctum_Peril = 'Starforged/Oracles/Vaults/Sanctum/Peril',
	Vaults_Sanctum_Purpose = 'Starforged/Oracles/Vaults/Sanctum/Purpose',
	Vaults_Scale = 'Starforged/Oracles/Vaults/Scale',
	Vaults_Shape = 'Starforged/Oracles/Vaults/Shape'
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
 * @public
 */
export declare enum DFSettingTruthName {
	Cataclysm = 'Cataclysm',
	Exodus = 'Exodus',
	Communities = 'Communities',
	Iron = 'Iron',
	Laws = 'Laws',
	Religion = 'Religion',
	Magic = 'Magic',
	CommunicationAndData = 'Communication and Data',
	Medicine = 'Medicine',
	ArtificialIntelligence = 'Artificial Intelligence',
	War = 'War',
	Lifeforms = 'Lifeforms',
	Precursors = 'Precursors',
	Horrors = 'Horrors'
}

/**
 * Enumerates valid sourcebook titles.
 * @public
 */
export declare enum DFSourceTitle {
	Starforged = 'Ironsworn: Starforged Rulebook',
	StarforgedAssets = 'Ironsworn: Starforged Assets',
	SunderedIslesPreview = 'Sundered Isles Preview',
	Ironsworn = 'Ironsworn Rulebook',
	IronswornAssets = 'Ironsworn Assets',
	IronswornDelve = 'Ironsworn: Delve',
	Custom = 'Custom'
}

/**
 * Enumerates valid source URLs.
 * @public
 */
export declare enum DFSourceUrl {
	Starforged = 'https://getstarforged.com',
	StarforgedAssets = 'https://getstarforged.com',
	Ironsworn = 'https://shawn-tomkin.itch.io/ironsworn',
	IronswornAssets = 'https://shawn-tomkin.itch.io/ironsworn',
	IronswornDelve = 'https://shawn-tomkin.itch.io/ironsworn-delve'
}

/**
 * Enumerates player character stats.
 * @public
 */
export declare enum DFStat {
	Edge = 'Edge',
	Heart = 'Heart',
	Iron = 'Iron',
	Shadow = 'Shadow',
	Wits = 'Wits'
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

/**
 * @public
 */
export declare enum DFVaultZone {
	Interior = 'Interior',
	Sanctum = 'Sanctum'
}

/**
 * @public
 */
export declare enum DFZone {
	Access = 'Access',
	Community = 'Community',
	Engineering = 'Engineering',
	Living = 'Living',
	Medical = 'Medical',
	Operations = 'Operations',
	Production = 'Production',
	Research = 'Research'
}

export {}
