import { StatField } from '../../fields/StatField'
import { ImpactField } from '../../fields/ImpactField'
import type { IronswornActor } from '../actor'
import { ProgressTicksField } from '../../fields/ProgressTicksField'
import type { DataSchema } from '../../fields/utils'
import type {
	ConditionMeterSource,
	MomentumSource
} from '../../fields/MeterField'
import { ConditionMeterField, MomentumField } from '../../fields/MeterField'
import { ActiveEffectDataConstructorData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/activeEffectData'
import { StatusEffect } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/client/data/documents/token'

export class CharacterData extends foundry.abstract.TypeDataModel<
	CharacterDataSourceData,
	IronswornActor<'character'>
> {
	constructor(
		...args: ConstructorParameters<
			typeof foundry.abstract.TypeDataModel<
				CharacterDataSourceData,
				IronswornActor<'character'>
			>
		>
	) {
		super(...args)
		this.burnMomentum = this.burnMomentum.bind(this)
	}

	static _enableV10Validation = true

	async burnMomentum(this: CharacterData) {
		if (this.canBurnMomentum) {
			await this.parent.update({
				system: { 'momentum.value': this.parent.system.momentum.resetValue }
			})
		}
	}

	get canBurnMomentum() {
		return (
			this.parent.system.momentum.value > this.parent.system.momentum.resetValue
		)
	}

	get #impactCount() {
		return Object.values(this.debility as any).filter((value) => value === true)
			.length
	}

	// FIXME: These won't be required when impacts are represented as ActiveEffects
	get momentumReset() {
		return Math.clamped(
			this.momentum.resetValue - this.#impactCount,
			MomentumField.RESET_MIN,
			this.momentum.max
		)
	}

	get momentumMax() {
		return Math.clamped(
			this.momentum.max - this.#impactCount,
			MomentumField.MIN,
			MomentumField.MAX
		)
	}

	static override defineSchema(): DataSchema<CharacterDataSourceData> {
		const fields = foundry.data.fields
		return {
			biography: new fields.HTMLField(),
			notes: new fields.HTMLField(),

			edge: new StatField({ label: 'IRONSWORN.Edge' }),
			heart: new StatField({ label: 'IRONSWORN.Heart' }),
			iron: new StatField({ label: 'IRONSWORN.Iron' }),
			shadow: new StatField({ label: 'IRONSWORN.Shadow' }),
			wits: new StatField({ label: 'IRONSWORN.Wits' }),

			// TODO: add a localized `hint` property, and have the vue sheet automatically pull these in as tooltips
			health: new ConditionMeterField({ label: 'IRONSWORN.Health' }),
			spirit: new ConditionMeterField({ label: 'IRONSWORN.Spirit' }),
			supply: new ConditionMeterField({ label: 'IRONSWORN.Supply' }),

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
export interface CharacterData extends CharacterDataSourceData {}
export interface CharacterDataSourceData {
	biography: string
	notes: string
	edge: number
	heart: number
	iron: number
	shadow: number
	wits: number

	health: ConditionMeterSource
	spirit: ConditionMeterSource
	supply: ConditionMeterSource
	momentum: MomentumSource
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
	legacies: {
		quests: number
		questsXpSpent: number
		bonds: number
		bondsXpSpent: number
		discoveries: number
		discoveriesXpSpent: number
	}
	xp: number
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
	data: CharacterData
	system: CharacterData
}
