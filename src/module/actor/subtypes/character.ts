import { ImpactField } from '../../fields/ImpactField'
import type {
	ConditionMeterSource,
	MomentumSource
} from '../../fields/MeterField'
import { ConditionMeterField, MomentumField } from '../../fields/MeterField'
import { StatField } from '../../fields/StatField'
import type { LegacyTrackSource } from '../../model/LegacyTrack'
import { LegacyTrack } from '../../model/LegacyTrack'
import type { IronswornActor } from '../actor'

export class CharacterModel extends foundry.abstract.TypeDataModel<
	CharacterDataSourceData,
	CharacterDataPropertiesData,
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

	static override defineSchema() {
		const fields = foundry.data.fields
		return {
			biography: new fields.HTMLField(),
			notes: new fields.HTMLField(),
			pronouns: new fields.StringField(),
			callsign: new fields.StringField(),

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

			legacies: new fields.SchemaField({
				quests: new fields.EmbeddedDataField(LegacyTrack, {
					label: 'IRONSWORN.LEGACY.Quests'
				}),
				bonds: new fields.EmbeddedDataField(LegacyTrack, {
					label: 'IRONSWORN.LEGACY.Bonds'
				}),
				discoveries: new fields.EmbeddedDataField(LegacyTrack, {
					label: 'IRONSWORN.LEGACY.Discoveries'
				})
			})
		}
	}

	static migrateData(source: Record<string, unknown>) {
		// @ts-expect-error
		super.migrateData(source)
		const migrate = foundry.abstract.Document._addDataFieldMigration

		const legacies = ['quests', 'bonds', 'discoveries']

		for (const legacy of legacies) {
			if (typeof source[legacy] === 'number')
				source[legacy] = { ticks: source[legacy] }
			migrate(source, `legacies.${legacy}XpSpent`, `legacies.${legacy}.xpSpent`)
		}

		return source
	}
}
export interface CharacterModel extends CharacterDataPropertiesData {}
export interface CharacterDataPropertiesData extends CharacterDataSourceData {
	health: ConditionMeterField
	spirit: ConditionMeterField
	supply: ConditionMeterField
	momentum: MomentumField

	legacies: {
		quests: LegacyTrack
		bonds: LegacyTrack
		discoveries: LegacyTrack
	}
}
export interface CharacterDataSourceData {
	biography: string
	notes: string
	pronouns: string
	callsign: string

	edge: number
	heart: number
	iron: number
	shadow: number
	wits: number

	health: ConditionMeterSource
	spirit: ConditionMeterSource
	supply: ConditionMeterSource
	momentum: MomentumSource

	xp: number

	legacies: {
		quests: LegacyTrackSource
		bonds: LegacyTrackSource
		discoveries: LegacyTrackSource
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
