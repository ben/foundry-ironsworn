import { StatField } from '../../fields/StatField'
import { MeterValueField } from '../../fields/MeterValueField'
import { ImpactField } from '../../fields/ImpactField'
import type { IronswornActor } from '../actor'
import { ProgressTicksField } from '../../fields/ProgressTicksField'
import type { DataSchema } from '../../fields/utils'
import type { PartialBy } from 'dataforged'

export class CharacterData extends foundry.abstract.DataModel<
	CharacterDataSourceData,
	IronswornActor<'character'>
> {
	constructor(
		...args: ConstructorParameters<
			typeof foundry.abstract.DataModel<
				CharacterDataSourceData,
				IronswornActor<'character'>
			>
		>
	) {
		super(...args)
		this.burnMomentum = this.burnMomentum.bind(this.parent)
		this.toggleActiveEffect = this.toggleActiveEffect.bind(this.parent)
	}

	static _enableV10Validation = true

	static readonly MOMENTUM_MAX = 10
	static readonly MOMENTUM_MIN = -6
	static readonly MOMENTUM_INITIAL = 2
	static readonly MOMENTUM_RESET_MIN = 0

	async burnMomentum(this: IronswornActor<'character'>) {
		if (this.system.momentum > this.system.momentumReset) {
			await this.update({
				system: { momentum: this.system.momentumReset }
			})
		}
	}

	/**
	 * A helper function to toggle a status effect which includes an Active Effect template
	 * @remarks Patterned after `Token#toggleActiveEffect`
	 * @param effectData The Active Effect data, including statusId
	 * @param options Options to configure application of the Active Effect
	 * @param options.overlay Should the Active Effect icon be displayed as an overlay on the token? (default: `true`)
	 * @param options.active Force a certain active state for the effect.
	 * @returns Whether the Active Effect is now on or off
	 */
	async toggleActiveEffect(
		this: IronswornActor<'character'>,
		effectData: { id: string; label: string; icon: string },
		options: { overlay?: boolean; active?: boolean }
	): Promise<boolean> {
		if (effectData.id == null) return false

		// Remove an existing effect
		const existing = this.effects.find(
			(e) => e.getFlag('core', 'statusId') === effectData.id
		)
		const state = options.active ?? existing == null
		if (!state && existing != null) await existing.delete()
		// Add a new effect
		else if (state) {
			const createData = foundry.utils.deepClone(effectData) as PartialBy<
				typeof effectData,
				'id'
			>
			createData.label = game.i18n.localize(effectData.label)
			createData['flags.core.statusId'] = effectData.id
			if (options.overlay != null) createData['flags.core.overlay'] = true
			delete createData.id
			const cls = getDocumentClass('ActiveEffect')
			await cls.create(createData, { parent: this })
		}
		return state
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

			health: new MeterValueField({ label: 'IRONSWORN.Health' }),
			spirit: new MeterValueField({ label: 'IRONSWORN.Spirit' }),
			supply: new MeterValueField({ label: 'IRONSWORN.Supply' }),

			momentum: new MeterValueField({
				label: 'IRONSWORN.Momentum',
				initial: (source) => {
					console.log('ironsworn momentum', source)
					return (source as any).momentumReset
				},
				max: CharacterData.MOMENTUM_MAX,
				min: CharacterData.MOMENTUM_MIN
			}),

			momentumMax: new fields.NumberField({
				integer: true,
				step: 1,
				initial: CharacterData.MOMENTUM_MAX,
				max: CharacterData.MOMENTUM_MAX
			}),
			momentumReset: new fields.NumberField({
				integer: true,
				step: 1,
				initial: CharacterData.MOMENTUM_INITIAL,
				max: CharacterData.MOMENTUM_MAX,
				min: CharacterData.MOMENTUM_RESET_MIN
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
	health: number
	spirit: number
	supply: number
	experience: number
	momentum: number
	momentumMax: number
	momentumReset: number
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
