import type {
	ConditionMeterSource,
	MomentumSource
} from '../../fields/MeterField'
import { ConditionMeterField, MomentumField } from '../../fields/MeterField'
import { ProgressTicksField } from '../../fields/ProgressTicksField'
import { StatField } from '../../fields/StatField'
import type { IronswornActor } from '../actor'
import type { IronActorModel } from './common'

export class CharacterModel
	extends foundry.abstract.TypeDataModel<
		CharacterDataSourceData,
		CharacterDataSourceData,
		IronswornActor<'character'>
	>
	implements IronActorModel
{
	isValidImpact(statusEffect: StatusEffectV11): boolean {
		// vehicle impact - skip
		// TODO: remove this when asset-provided impacts are implemented
		// if (statusEffect.flags?.['foundry-ironsworn'].category === 'vehicle')
		// 	return false

		return statusEffect.flags?.['foundry-ironsworn']?.type === 'impact'
	}

	constructor(
		data: CharacterDataSourceData,
		options: foundry.data.fields.DataField.Options<
			CharacterDataSourceData,
			CharacterDataSourceData
		> & { parent: IronswornActor<'character'> }
	) {
		super(data, options)
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

	async burnMomentum(this: CharacterModel) {
		if (this.canBurnMomentum) await this.resetMomentum()
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
export interface CharacterModel extends CharacterDataSourceData {}
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
	data: CharacterModel
	system: CharacterModel
}
