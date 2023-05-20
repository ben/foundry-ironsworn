import { StatField } from '../../fields/StatField'
import { MeterValueField } from '../../fields/MeterValueField'
import { ImpactField } from '../../fields/ImpactField'
import type { IronswornActor } from '../actor'
import { ProgressTicksField } from '../../fields/ProgressTicksField'
import type { SchemaToSourceData } from '../../fields/utils'
import { clamp } from 'lodash-es'

export class CharacterData extends foundry.abstract.DataModel<
	any,
	IronswornActor<'character'>
> {
	protected override _configure(...args) {
		super._configure(...args)
	}

	static _enableV10Validation = true

	static readonly MOMENTUM_MAX = 10
	static readonly MOMENTUM_MIN = -6
	static readonly MOMENTUM_INITIAL = 2
	static readonly MOMENTUM_RESET_MIN = 0

	async burnMomentum() {
		if (this.momentum > this.momentumReset) {
			await this.parent.update({
				system: { momentum: this.momentumReset }
			})
		}
	}

	get #impactCount() {
		return Object.values(this.debility as any).filter((value) => value === true)
			.length
	}

	get momentumReset() {
		return clamp(
			CharacterData.MOMENTUM_INITIAL - this.#impactCount,
			CharacterData.MOMENTUM_RESET_MIN,
			CharacterData.MOMENTUM_MAX
		)
	}

	get momentumMax() {
		return clamp(
			CharacterData.MOMENTUM_MAX - this.#impactCount,
			CharacterData.MOMENTUM_MIN,
			CharacterData.MOMENTUM_MAX
		)
	}

	static override defineSchema() {
		const fields = foundry.data.fields
		return {
			biography: new fields.HTMLField(),
			notes: new fields.HTMLField(),

			edge: new StatField({ label: 'IRONSWORN.Edge' }),
			heart: new StatField({ label: 'IRONSWORN.Heart' }),
			iron: new StatField({ label: 'IRONSWORN.Iron' }),
			shadow: new StatField({ label: 'IRONSWORN.Shadow' }),
			wits: new StatField({ label: 'IRONSWORN.Wits' }),

			health: new MeterValueField({ label: 'IRONSWORN.Health' }),
			spirit: new MeterValueField({ label: 'IRONSWORN.Spirit' }),
			supply: new MeterValueField({ label: 'IRONSWORN.Supply' }),

			momentum: new MeterValueField({
				label: 'IRONSWORN.Momentum',
				initial: (source) => (source as any).momentumReset,
				max: this.MOMENTUM_MAX,
				min: this.MOMENTUM_MIN
			}),

			experience: new fields.NumberField({
				integer: true,
				required: true,
				step: 1,
				initial: 0,
				min: 0
			}),
			xp: new fields.NumberField({
				integer: true,
				required: true,
				step: 1,
				min: 0,
				initial: 0
			}),

			debility: new fields.SchemaField({
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
				quests: new ProgressTicksField({
					max: undefined,
					required: true
				}),
				questsXpSpent: new fields.NumberField({
					initial: 0,
					required: true
				}),
				bonds: new ProgressTicksField({
					max: undefined,
					required: true
				}),
				bondsXpSpent: new fields.NumberField({
					initial: 0,
					required: true
				}),
				discoveries: new ProgressTicksField({
					max: undefined,
					required: true
				}),
				discoveriesXpSpent: new fields.NumberField({
					initial: 0,
					required: true
				})
			})
		}
	}
}
export interface CharacterData
	extends SchemaToSourceData<typeof CharacterData> {}

export interface CharacterDataSource {
	type: 'character'
	/**
	 * @deprecated
	 */
	data: CharacterData
	system: CharacterData
}

export interface CharacterDataProperties {
	type: 'character'
	/**
	 * @deprecated
	 */
	data: InstanceType<typeof CharacterData>
	system: InstanceType<typeof CharacterData>
}
