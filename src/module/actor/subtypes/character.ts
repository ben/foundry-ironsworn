import { StatField } from '../../fields/StatField'
import type { IronswornActor } from '../actor'
import { ProgressTicksField } from '../../fields/ProgressTicksField'
import type { DataSchema } from '../../fields/utils'
import type { ActiveEffectDataConstructorData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/activeEffectData'
import type { IronActiveEffect } from '../../active-effect/active-effect'
import { ConditionMeterField, MomentumField } from '../../fields/MeterField'
import type {
	ConditionMeterSource,
	MomentumSource
} from '../../fields/MeterField'
import type { IronActorModel } from './common'
import { IronswornSettings } from '../../helpers/settings'
import type { ConfiguredFlags } from '@league-of-foundry-developers/foundry-vtt-types/src/types/helperTypes'

export class CharacterData
	extends foundry.abstract.TypeDataModel<
		CharacterDataSourceData,
		IronswornActor<'character'>
	>
	implements IronActorModel
{
	static _enableV10Validation = true
	static readonly CUSTOM_IMPACT_IDS = ['custom1', 'custom2']

	isValidImpact(statusEffect: StatusEffectV11): boolean {
		// not an impact - skip
		if (statusEffect.flags?.['foundry-ironsworn']?.type !== 'impact')
			return false
		// vehicle impact - skip
		// TODO: remove this when asset-provided impacts are implemented
		// if (statusEffect.flags?.['foundry-ironsworn'].category === 'vehicle')
		// 	return false

		return true
	}

	constructor(
		...args: ConstructorParameters<
			typeof foundry.abstract.TypeDataModel<
				CharacterDataSourceData,
				IronswornActor<'character'>
			>
		>
	) {
		super(...args)
		this.resetMomentum = this.resetMomentum.bind(this)
		this.burnMomentum = this.burnMomentum.bind(this)
	}

	get canBurnMomentum() {
		return this.momentum.value >= MomentumField.BURN_MIN
	}

	async resetMomentum() {
		return await this.parent.update({
			'system.momentum.value': this.parent.system.momentum.resetValue
		})
	}

	async burnMomentum(this: CharacterData) {
		if (this.canBurnMomentum) await this.resetMomentum()
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
			// TODO: pass the labels to $capitalize ahead of time
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
