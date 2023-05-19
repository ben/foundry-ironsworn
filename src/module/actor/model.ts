import { ChallengeRank } from '../constants'
import { localizeRank } from '../helpers/util'
import type {
	CharacterDataSourceData,
	CharacterDataPropertiesData,
	SharedDataSourceData,
	SharedDataPropertiesData,
	FoeDataSourceData,
	FoeDataPropertiesData,
	SiteDataSourceData,
	SiteDataPropertiesData,
	StarshipDataPropertiesData,
	StarshipDataSourceData,
	LocationDataPropertiesData,
	LocationDataSourceData
} from './actortypes'
import type { FieldToData } from './fields/utils'

export class StatField extends foundry.data.fields.NumberField {
	constructor({ label }: Pick<foundry.data.fields.NumberField, 'label'>) {
		super({
			label,
			integer: true,
			required: true,
			step: 1,
			min: 0,
			max: 4,
			initial: 1
		})
	}
}
export class MeterField extends foundry.data.fields.NumberField {
	constructor({
		label,
		max = 5,
		min = 0,
		initial = max as any
	}: Pick<foundry.data.fields.NumberField, 'label'> &
		Partial<Pick<foundry.data.fields.NumberField, 'max' | 'min' | 'initial'>>) {
		super({
			label,
			integer: true,
			required: true,
			step: 1,
			min,
			max,
			initial
		})
	}
}

export class ImpactField extends foundry.data.fields.BooleanField {
	/**
	 *
	 */
	constructor(
		options?: Omit<
			Partial<foundry.data.fields.BooleanField.Options>,
			'initial' | 'required'
		>
	) {
		super({
			initial: false,
			required: true,
			...options
		})
	}
}

export class CharacterData
	extends foundry.abstract.DataModel<any, any>
	implements CharacterDataPropertiesData
{
	static _enableV10Validation = true
	static readonly MOMENTUM_MAX = 10
	static readonly MOMENTUM_MIN = -6
	static readonly MOMENTUM_INITIAL = 2
	static readonly MOMENTUM_RESET_MIN = 0

	declare biography: CharacterDataSourceData['biography']
	declare notes: CharacterDataSourceData['notes']
	declare edge: CharacterDataSourceData['edge']
	declare heart: CharacterDataSourceData['heart']
	declare iron: CharacterDataSourceData['iron']
	declare shadow: CharacterDataSourceData['shadow']
	declare wits: CharacterDataSourceData['wits']
	declare health: CharacterDataSourceData['health']
	declare spirit: CharacterDataSourceData['spirit']
	declare supply: CharacterDataSourceData['supply']
	declare experience: CharacterDataSourceData['experience']
	declare momentum: CharacterDataSourceData['momentum']
	declare debility: CharacterDataSourceData['debility']
	declare legacies: CharacterDataSourceData['legacies']
	declare xp: CharacterDataSourceData['xp']

	get #impactCount() {
		return Object.values(this.debility as any).filter((value) => value === true)
			.length
	}

	get momentumReset() {
		return Math.max(
			CharacterData.MOMENTUM_RESET_MIN,
			CharacterData.MOMENTUM_INITIAL - this.#impactCount
		)
	}

	get momentumMax() {
		return CharacterData.MOMENTUM_MAX - this.#impactCount
	}

	static override defineSchema(): Record<
		keyof CharacterDataSourceData,
		foundry.data.fields.DataField.Any
	> {
		return {
			biography: new foundry.data.fields.HTMLField(),
			notes: new foundry.data.fields.HTMLField(),

			edge: new StatField({ label: 'IRONSWORN.Edge' }),
			heart: new StatField({ label: 'IRONSWORN.Heart' }),
			iron: new StatField({ label: 'IRONSWORN.Iron' }),
			shadow: new StatField({ label: 'IRONSWORN.Shadow' }),
			wits: new StatField({ label: 'IRONSWORN.Wits' }),

			health: new MeterField({ label: 'IRONSWORN.Health' }),
			spirit: new MeterField({ label: 'IRONSWORN.Spirit' }),
			supply: new MeterField({ label: 'IRONSWORN.Supply' }),

			// momentumReset: new foundry.data.fields.NumberField({
			// 	integer: true,
			// 	required: true,
			// 	initial: this.MOMENTUM_INITIAL,
			// 	min: 0,
			// 	max: this.MOMENTUM_MAX
			// }),
			// momentumMax: new foundry.data.fields.NumberField({
			// 	integer: true,
			// 	required: true,
			// 	initial: this.MOMENTUM_MAX,
			// 	max: this.MOMENTUM_MAX
			// }),
			momentum: new MeterField({
				label: 'IRONSWORN.Momentum',
				initial: (source) =>
					(source as CharacterDataPropertiesData).momentumReset,
				max: this.MOMENTUM_MAX,
				min: this.MOMENTUM_MIN
			}),

			experience: new foundry.data.fields.NumberField({
				integer: true,
				required: true,
				step: 1,
				initial: 0,
				min: 0
			}),
			xp: new foundry.data.fields.NumberField({
				integer: true,
				required: true,
				step: 1,
				min: 0,
				initial: 0
			}),

			debility: new foundry.data.fields.SchemaField({
				corrupted: new ImpactField(),
				cursed: new ImpactField(),
				encumbered: new ImpactField(),
				maimed: new ImpactField(),
				shaken: new ImpactField(),
				tormented: new ImpactField(),
				unprepared: new ImpactField(),
				wounded: new ImpactField(),
				permanentlyharmed: new ImpactField(),
				traumatized: new ImpactField(),
				doomed: new ImpactField(),
				indebted: new ImpactField(),
				battered: new ImpactField(),

				custom1: new ImpactField(),
				custom1name: new foundry.data.fields.StringField({}),
				custom2: new ImpactField(),
				custom2name: new foundry.data.fields.StringField({})
			}),

			legacies: new foundry.data.fields.SchemaField({
				quests: new foundry.data.fields.NumberField({
					initial: 0,
					required: true
				}),
				questsXpSpent: new foundry.data.fields.NumberField({
					initial: 0,
					required: true
				}),
				bonds: new foundry.data.fields.NumberField({
					initial: 0,
					required: true
				}),
				bondsXpSpent: new foundry.data.fields.NumberField({
					initial: 0,
					required: true
				}),
				discoveries: new foundry.data.fields.NumberField({
					initial: 0,
					required: true
				}),
				discoveriesXpSpent: new foundry.data.fields.NumberField({
					initial: 0,
					required: true
				})
			})
		}
	}
}

export class SharedData
	extends foundry.abstract.DataModel<any, any>
	implements SharedDataPropertiesData
{
	static _enableV10Validation = true

	declare biography: SharedDataSourceData['biography']
	declare supply: SharedDataSourceData['supply']

	static override defineSchema(): Record<
		keyof SharedDataSourceData,
		foundry.data.fields.DataField.Any
	> {
		return {
			biography: new foundry.data.fields.HTMLField(),
			supply: new MeterField({ label: 'IRONSWORN.Supply' })
		}
	}
}

export class FoeData
	extends foundry.abstract.DataModel<any, any>
	implements FoeDataPropertiesData
{
	static _enableV10Validation = true

	static override defineSchema(): Record<
		keyof FoeDataSourceData,
		foundry.data.fields.DataField.Any
	> {
		return {}
	}
}

function enumEntries(enumLike) {
	const keys = Object.values(enumLike).filter(
		(x) => !isNaN(+(x as number | string))
	) as Array<keyof typeof enumLike>
	return keys.map((k) => [k, enumLike[k]]) as [[string, number]]
}

export class ChallengeRankField extends foundry.data.fields
	.NumberField<ChallengeRank> {
	/**
	 *
	 */
	constructor(
		options?: Partial<
			Omit<
				foundry.data.fields.NumberField.Options<ChallengeRank>,
				'choices' | 'step' | 'integer' | 'max' | 'min' | 'positive'
			>
		>
	) {
		super({
			label: 'IRONSWORN.ChallengeRank',
			choices: Object.fromEntries(
				enumEntries(ChallengeRank).map(([k, v]) => [v, localizeRank(v)])
			),
			initial: ChallengeRank.Troublesome,
			step: 1,
			integer: true,
			max: ChallengeRank.Epic,
			min: ChallengeRank.Troublesome,
			...options
		})
	}
}

export class ProgressTicksField extends foundry.data.fields.NumberField {
	/**
	 *
	 */
	constructor(
		options?: Omit<
			Partial<foundry.data.fields.NumberField>,
			'choices' | 'step' | 'integer' | 'min' | 'positive'
		>
	) {
		super({
			min: 0,
			initial: 0,
			max: 40,
			integer: true,
			step: 1,
			...options
		})
	}
}

export class SiteData
	extends foundry.abstract.DataModel<any, any>
	implements SiteDataPropertiesData
{
	declare objective: SiteDataPropertiesData['objective']
	declare description: SiteDataPropertiesData['description']
	declare notes: SiteDataPropertiesData['notes']
	declare rank: SiteDataPropertiesData['rank']
	declare current: SiteDataPropertiesData['current']
	declare denizens: SiteDataPropertiesData['denizens']

	static _enableV10Validation = true

	static override defineSchema(): Record<
		keyof SiteDataSourceData,
		foundry.data.fields.DataField.Any
	> {
		return {
			rank: new ChallengeRankField(),
			current: new ProgressTicksField(),
			objective: new foundry.data.fields.HTMLField(),
			description: new foundry.data.fields.HTMLField(),
			notes: new foundry.data.fields.HTMLField(),
			denizens: new foundry.data.fields.ArrayField(
				new foundry.data.fields.EmbeddedDataField(
					foundry.documents.BaseTableResult
				)
			)
		}
	}
}

export class StarshipData
	extends foundry.abstract.DataModel<any, any>
	implements StarshipDataPropertiesData
{
	declare health: StarshipDataPropertiesData['health']
	declare debility: StarshipDataPropertiesData['debility']

	static override defineSchema(): Record<
		keyof StarshipDataSourceData,
		foundry.data.fields.DataField.Any
	> {
		return {
			health: new MeterField({ label: 'IRONSWORN.Integrity' }),
			debility: new foundry.data.fields.SchemaField({
				battered: new ImpactField(),
				cursed: new ImpactField()
			})
		}
	}
}

export class LocationData
	extends foundry.abstract.DataModel<any, any>
	implements LocationDataPropertiesData
{
	declare subtype: LocationDataPropertiesData['subtype']
	declare klass: LocationDataPropertiesData['klass']
	declare description: LocationDataPropertiesData['description']

	static override defineSchema() {
		return {
			subtype: new foundry.data.fields.StringField(),
			klass: new foundry.data.fields.StringField(),
			description: new foundry.data.fields.HTMLField()
		}
	}
}

export type SchemaToSourceData<
	T extends typeof foundry.abstract.DataModel<any, any>
> = {
	[K in keyof ReturnType<T['defineSchema']>]: FieldToData<
		ReturnType<T['defineSchema']>[K]
	>
}

export type props = SchemaToSourceData<typeof LocationData>

// export class

// export class AssetDataField extends foundry.data.fields.SystemDataField<
// 	'Item',
// 	'asset'
// > {
// 	static override defineSchema(): foundry.data.fields.DataSchema<AssetDataPropertiesData> {
// 		const fields = foundry.data.fields

// 		return {
// 			category: new foundry.data.fields.StringField(),
// 			description: new foundry.data.fields.HTMLField(),
// 			requirement: new foundry.data.fields.HTMLField(),
// 			color: new foundry.data.fields.ColorField(),
// 			fields: new foundry.data.fields.ArrayField(
// 				new foundry.data.fields.SchemaField({
// 					name: new foundry.data.fields.StringField(),
// 					value: new foundry.data.fields.StringField()
// 				})
// 			),
// 			abilities: new foundry.data.fields.ArrayField(
// 				new foundry.data.fields.SchemaField({
// 					name: new foundry.data.fields.StringField(),
// 					enabled: new foundry.data.fields.BooleanField(),
// 					description: new foundry.data.fields.HTMLField(),
// 					hasClock: new foundry.data.fields.BooleanField(),
// 					clockMax: new foundry.data.fields.NumberField(),
// 					clockTicks: new foundry.data.fields.NumberField()
// 				})
// 			),
// 			track: new foundry.data.fields.SchemaField({
// 				name: new foundry.data.fields.StringField(),
// 				enabled: new foundry.data.fields.BooleanField({ initial: false }),
// 				current: new foundry.data.fields.NumberField({ integer: true, min: 0 }),
// 				max: new foundry.data.fields.NumberField({ integer: true, positive: true })
// 			}),
// 			exclusiveOptions: new foundry.data.fields.ArrayField(
// 				new foundry.data.fields.SchemaField({
// 					name: new foundry.data.fields.StringField(),
// 					selected: new foundry.data.fields.BooleanField()
// 				})
// 			),
// 			conditions: new foundry.data.fields.ArrayField(
// 				new foundry.data.fields.SchemaField({
// 					name: new foundry.data.fields.StringField(),
// 					ticked: new foundry.data.fields.BooleanField()
// 				})
// 			)
// 		}
// 	}
// }

// export class SFMoveDataField extends foundry.data.fields.SystemDataField<
// 	'Item',
// 	'sfmove'
// > {
// 	static override defineSchema(): foundry.data.fields.DataSchema<SFMoveDataPropertiesData> {
// 		const fields = foundry.data.fields
// 		return {
// 			dfid: new DataforgedIDField(),
// 			Asset: new DataforgedIDField(),
// 			Name: new foundry.data.fields.StringField(),
// 			'Progress Move': new foundry.data.fields.BooleanField(),
// 			'Variant of': new DataforgedIDField(),
// 			Category: new DataforgedIDField(),
// 			Oracles: new foundry.data.fields.ArrayField(new DataforgedIDField()),
// 			Text: new foundry.data.fields.HTMLField(),
// 			Optional: new foundry.data.fields.BooleanField(),
// 			Tags: new foundry.data.fields.ArrayField(new foundry.data.fields.StringField()),
// 			Trigger: new foundry.data.fields.SchemaField({
//         Text: new foundry.data.fields.HTMLField(),
//         By: new foundry.data.fields.SchemaField({}),
//         Options: new foundry.data.fields.ArrayField(new foundry.data.fields.SchemaField({}))
//       }),
// 			Display: new foundry.data.fields.SchemaField({}),
// 			Outcomes: new foundry.data.fields.SchemaField({}),
// 			Source: new foundry.data.fields.SchemaField({}),
// 			Suggestions: new foundry.data.fields.SchemaField({})
// 		}
// 	}
// }

// export class DataforgedIDField extends foundry.data.fields.StringField {}
