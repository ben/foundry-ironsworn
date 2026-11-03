import { StatField } from '../../fields/StatField'
import { ImpactField } from '../../fields/ImpactField'
import type { IronswornActor } from '../actor'
import { ProgressTicksField } from '../../fields/ProgressTicksField'
import type {
	ConditionMeterSource,
	MomentumSource
} from '../../fields/MeterField'
import { ConditionMeterField, MomentumField } from '../../fields/MeterField'

export class CharacterModel extends foundry.abstract.TypeDataModel<
	CharacterDataSourceData,
	CharacterDataSourceData,
	IronswornActor<'character'>
> {
	constructor(
		data: CharacterDataSourceData,
		options: foundry.data.fields.DataField.Options<
			CharacterDataSourceData,
			CharacterDataSourceData
		> & { parent: IronswornActor<'character'> }
	) {
		super(data, options)
		this.burnMomentum = this.burnMomentum.bind(this)
	}

	static _enableV10Validation = true

	async burnMomentum(this: CharacterModel) {
		if (this.canBurnMomentum) {
			await this.parent.update({
				system: { 'momentum.value': this.parent.system.momentumReset }
			})
		}
	}

	/**
	 * Adds a pending bonus to the character's next move, e.g. "add +1 on your
	 * next move" from Secure an Advantage. It stays pending until a roll is made
	 * with it ticked in the roll dialog.
	 */
	async addNextMoveBonus(this: CharacterModel, source: string, value = 1) {
		const bonus: NextMoveBonus = {
			id: foundry.utils.randomID(),
			source,
			value
		}
		await this.parent.update({
			system: { nextMoveBonuses: [...this.nextMoveBonuses, bonus] }
		})
	}

	/** Removes pending next-move bonuses, e.g. once a roll has spent them. */
	async removeNextMoveBonuses(this: CharacterModel, ids: string[]) {
		if (ids.length === 0) return
		await this.parent.update({
			system: {
				nextMoveBonuses: this.nextMoveBonuses.filter((x) => !ids.includes(x.id))
			}
		})
	}

	get canBurnMomentum() {
		return this.parent.system.momentum.value > this.parent.system.momentumReset
	}

	get #impactCount() {
		return Object.values(this.debility as any).filter((value) => value === true)
			.length
	}

	// FIXME: These won't be required when impacts are represented as ActiveEffects
	get momentumReset() {
		return Math.clamp(
			this.momentum.resetValue - this.#impactCount,
			MomentumField.RESET_MIN,
			this.momentum.max
		)
	}

	get momentumMax() {
		return Math.clamp(
			this.momentum.max - this.#impactCount,
			MomentumField.MIN,
			MomentumField.MAX
		)
	}

	static override defineSchema() {
		const fields = foundry.data.fields
		return {
			biography: new fields.HTMLField(),
			notes: new fields.HTMLField(),
			pronouns: new fields.StringField(),
			callsign: new fields.StringField(),
			combatPosition: new fields.StringField({
				required: false,
				blank: true,
				choices: {
					inControl: 'IRONSWORN.CombatPosition.InControl',
					inABadSpot: 'IRONSWORN.CombatPosition.InABadSpot',
					none: 'IRONSWORN.CombatPosition.None'
				}
			}),

			edge: new StatField({ label: 'IRONSWORN.Edge' }),
			heart: new StatField({ label: 'IRONSWORN.Heart' }),
			iron: new StatField({ label: 'IRONSWORN.Iron' }),
			shadow: new StatField({ label: 'IRONSWORN.Shadow' }),
			wits: new StatField({ label: 'IRONSWORN.Wits' }),

			// TODO: add a localized `hint` property, and have the vue sheet automatically pull these in as tooltips
			health: new ConditionMeterField({ label: 'IRONSWORN.Health' }),
			spirit: new ConditionMeterField({ label: 'IRONSWORN.Spirit' }),
			supply: new ConditionMeterField({ label: 'IRONSWORN.Supply' }),
			hold: new ConditionMeterField({ label: 'IRONSWORN.Hold' }),

			momentum: new MomentumField(),

			xp: new fields.NumberField({
				integer: true,
				required: true,
				min: 0,
				initial: 0
			}),

			debility: new fields.SchemaField<CharacterDataSourceData['debility']>({
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
				custom1name: new fields.StringField({}),
				custom2: new ImpactField(),
				custom2name: new fields.StringField({})
			}),

			nextMoveBonuses: new fields.ArrayField(
				new fields.SchemaField({
					id: new fields.StringField({ required: true, blank: false }),
					source: new fields.StringField({ initial: '' }),
					value: new fields.NumberField({ integer: true, initial: 1 })
				})
			),

			legacies: new fields.SchemaField<CharacterDataSourceData['legacies']>({
				quests: new ProgressTicksField({
					max: undefined
				}),
				questsXpSpent: new fields.NumberField({
					initial: 0
				}),
				bonds: new ProgressTicksField({
					max: undefined
				}),
				bondsXpSpent: new fields.NumberField({
					initial: 0
				}),
				discoveries: new ProgressTicksField({
					max: undefined
				}),
				discoveriesXpSpent: new fields.NumberField({
					initial: 0
				})
			})
		}
	}
}
export interface CharacterModel extends CharacterDataSourceData {}

/** A pending bonus to a character's next (non-progress) move. */
export interface NextMoveBonus {
	id: string
	source: string
	value: number
}
export interface CharacterDataSourceData {
	biography: string
	notes: string
	pronouns: string
	callsign: string
	combatPosition?: 'inControl' | 'inABadSpot' | 'none'

	edge: number
	heart: number
	iron: number
	shadow: number
	wits: number

	health: ConditionMeterSource
	spirit: ConditionMeterSource
	supply: ConditionMeterSource
	hold: ConditionMeterSource
	momentum: MomentumSource

	xp: number
	nextMoveBonuses: NextMoveBonus[]
	legacies: {
		quests: number
		questsXpSpent: number
		bonds: number
		bondsXpSpent: number
		discoveries: number
		discoveriesXpSpent: number
	}

	debility: {
		corrupted: boolean
		cursed: boolean
		encumbered: boolean
		maimed: boolean
		shaken: boolean
		tormented: boolean
		unprepared: boolean
		wounded: boolean
		permanentlyharmed: boolean
		traumatized: boolean
		doomed: boolean
		indebted: boolean
		battered: boolean
		custom1: boolean
		custom1name: string
		custom2: boolean
		custom2name: string
	}
}

export interface CharacterDataSource {
	type: 'character'
	/**
	 * @deprecated
	 */
	data: CharacterDataSourceData
	system: CharacterDataSourceData
}

export interface CharacterDataProperties {
	type: 'character'
	/**
	 * @deprecated
	 */
	data: CharacterModel
	system: CharacterModel
}
