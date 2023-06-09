import { StatField } from '../../fields/StatField'
import type { IronswornActor } from '../actor'
import { ProgressTicksField } from '../../fields/ProgressTicksField'
import type { DataSchema } from '../../fields/utils'
import type { ActorDataSource } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/actorData'
import type { ActiveEffectDataConstructorData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/activeEffectData'
import { IronActiveEffect } from '../../active-effect/active-effect'
import { ConditionMeterField, MomentumField } from '../../fields/MeterField'
import type {
	ConditionMeterSource,
	MomentumSource
} from '../../fields/MeterField'

export class CharacterData extends foundry.abstract.TypeDataModel<
	CharacterDataSourceData,
	IronswornActor<'character'>
> {
	static _enableV10Validation = true

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

	async burnMomentum(this: CharacterData) {
		if (this.canBurnMomentum) {
			await this.parent.update({
				system: { 'momentum.value': this.parent.system.momentum.resetValue }
			})
		}
	}

	get customImpacts() {
		const customImpactIDs = ['custom1', 'custom2']
		return this.parent.effects.filter((impact) =>
			customImpactIDs.some((id) => (impact as any).statuses.has(id))
		)
	}

	static override migrateData(source: Record<string, unknown>) {
		source = super.migrateData(source) as Record<string, unknown> &
			ActorDataSource

		if ('debility' in source) {
			const debilities = source.debility as Record<string, boolean | string>
			if (source.effects == null)
				source.effects = [] as ActiveEffectDataConstructorData[]

			const customKeys = ['custom1', 'custom2']

			for (const id of customKeys) {
				const value = debilities[id]
				if (value !== true) continue
				const label = (debilities[`${id}name`] as string) ?? ''

				;(source.effects as ActiveEffectDataConstructorData[]).push(
					IronActiveEffect.statusToActiveEffectData(
						IronActiveEffect.createImpact({ id, label })
					)
				)
			}

			for (const [key, value] of Object.entries(debilities)) {
				if (key.startsWith('custom') || value !== true) continue
				;(source.effects as any[]).push(
					foundry.utils.deepClone(
						CONFIG.statusEffects.find((fx) => fx.id === key)
					)
				)
			}

			delete source.debility
		}

		return source
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

	xp: number
	legacies: {
		quests: number
		questsXpSpent: number
		bonds: number
		bondsXpSpent: number
		discoveries: number
		discoveriesXpSpent: number
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
	data: CharacterData
	system: CharacterData
}
