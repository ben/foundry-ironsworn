import type { IronswornActor } from '../actor/actor'
import type { EffectChangeData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/effectChangeData'
import type { PartialBy, PartialDeep } from 'dataforged'
import { CharacterData } from '../actor/config'
import { clamp } from 'lodash-es'
import type { StatusEffect } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/client/data/documents/token'
import { IronswornSettings } from '../helpers/settings'
import type { ActiveEffectDataConstructorData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/activeEffectData'
import type { DocumentSubTypes } from '../../types/helperTypes'

type ImpactCategoryStarforged = 'conditions' | 'banes' | 'burdens'
type DebilityCategoryClassic =
	| 'misfortunes'
	| 'lastingEffects'
	| 'burdens'
	| 'vehicle'

export type ImpactCategory = ImpactCategoryStarforged | DebilityCategoryClassic

interface ImpactFlags {
	/**
	 * Some impacts, like Wounded, prevent recovery of a certain player resource. Include an actor path to the resource in question (e.g. `system.health`) if this is desired.
	 */
	preventRecovery?: string
	global?: boolean
	globalHint?: boolean
	/**
	 * A value for the `foundry-ironsworn.category` flag.
	 */
	category?: ImpactCategory
}

type ImpactOptions = StatusEffect & ImpactFlags

export class IronActiveEffect extends ActiveEffect {
	static get customLabelFallback() {
		return IronswornSettings.starforgedToolsEnabled
			? 'IRONSWORN.IMPACT.Custom'
			: 'IRONSWORN.DEBILITY.Custom'
	}

	static IMPACT_ICON_DEFAULT =
		'systems/foundry-ironsworn/assets/icons/impacts/custom.svg'

	/**
	 * Sets an active effect across all actors of the provided types.
	 * @param statusEffect Data for the status effect to be applied
	 * @param active Should the effect be set to active? If false, the effect will instead be disabled.
	 * @param actorTypes The types of actor for this effect to be applied to. (default: `['character', 'starship']`)
	 */
	static async setGlobal(
		statusEffect: StatusEffect,
		active: boolean,
		actorTypes: Array<DocumentSubTypes<'Actor'>> = ['character', 'starship']
	) {
		const actorsToUpdate =
			game.actors?.contents.filter((x) => actorTypes.includes(x.type)) ?? []

		for await (const actor of actorsToUpdate) {
			await actor.toggleActiveEffect(statusEffect, { active })
		}
	}

	static statusToActiveEffectData(effectData: StatusEffect) {
		const createData = foundry.utils.deepClone(effectData) as PartialBy<
			typeof effectData,
			'id'
		>
		createData.label = game.i18n.localize(effectData.label as string)
		createData['flags.core.statusId'] = effectData.id
		delete createData.id
		return createData as ActiveEffectDataConstructorData
	}

	/**
	 * Create constructor data for an active effect that represents and impact/debility.
	 */
	static createImpact({
		id,
		label,
		icon,
		preventRecovery,
		global,
		globalHint,
		category,
		disabled
	}: ImpactOptions) {
		if (icon == null) icon = this.IMPACT_ICON_DEFAULT
		const result: StatusEffect = {
			id,
			disabled,
			label:
				typeof label === 'string' && label.length > 0
					? label
					: IronActiveEffect.customLabelFallback,
			icon: icon ?? IronActiveEffect.IMPACT_ICON_DEFAULT,
			duration: null,
			changes: [
				{
					key: 'system.momentumMax',
					mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
					value: '-1'
				},
				{
					key: 'system.momentumReset',
					mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
					value: '-1'
				}
			],
			flags: {
				'foundry-ironsworn': {
					type: 'impact',
					preventRecovery,
					globalHint,
					global,
					category
				}
			}
		}
		if (preventRecovery != null)
			result.changes?.push({
				key: preventRecovery,
				mode: CONST.ACTIVE_EFFECT_MODES.DOWNGRADE,
				value: '0'
			})
		return result
	}

	static readonly statusEffects: Record<string, StatusEffect[]> = {
		starforged: [
			this.createImpact({
				id: 'wounded',
				label: 'IRONSWORN.IMPACT.Wounded',
				icon: 'systems/foundry-ironsworn/assets/icons/impacts/wounded.svg',
				preventRecovery: 'system.health',
				category: 'misfortunes'
			}),
			this.createImpact({
				id: 'shaken',
				label: 'IRONSWORN.IMPACT.Shaken',
				icon: 'systems/foundry-ironsworn/assets/icons/impacts/shaken.svg',
				preventRecovery: 'system.spirit',
				category: 'misfortunes'
			}),
			this.createImpact({
				id: 'unprepared',
				label: 'IRONSWORN.IMPACT.Unprepared',
				icon: 'systems/foundry-ironsworn/assets/icons/impacts/unprepared.svg',
				preventRecovery: 'system.supply',
				category: 'misfortunes',
				global: true
			}),
			this.createImpact({
				id: 'permanentlyharmed',
				label: 'IRONSWORN.IMPACT.Permanentlyharmed',
				icon: 'systems/foundry-ironsworn/assets/icons/impacts/permanentlyharmed.svg',
				category: 'lastingEffects'
			}),
			this.createImpact({
				id: 'traumatized',
				label: 'IRONSWORN.IMPACT.Traumatized',
				icon: 'systems/foundry-ironsworn/assets/icons/impacts/traumatized.svg',
				category: 'lastingEffects'
			}),
			this.createImpact({
				id: 'tormented',
				label: 'IRONSWORN.IMPACT.Tormented',
				icon: 'systems/foundry-ironsworn/assets/icons/impacts/tormented.svg',
				category: 'burdens'
			}),
			this.createImpact({
				id: 'doomed',
				label: 'IRONSWORN.IMPACT.Doomed',
				icon: 'systems/foundry-ironsworn/assets/icons/impacts/doomed.svg',
				category: 'burdens'
			}),
			this.createImpact({
				id: 'indebted',
				label: 'IRONSWORN.IMPACT.Indebted',
				icon: 'systems/foundry-ironsworn/assets/icons/impacts/indebted.svg',
				category: 'burdens'
			}),
			this.createImpact({
				id: 'cursed',
				label: 'IRONSWORN.IMPACT.Cursed',
				icon: 'systems/foundry-ironsworn/assets/icons/impacts/cursed_starforged.svg',
				globalHint: true,
				category: 'vehicle'
			}),
			this.createImpact({
				id: 'battered',
				label: 'IRONSWORN.IMPACT.Battered',
				icon: 'systems/foundry-ironsworn/assets/icons/impacts/battered.svg',
				globalHint: true,
				category: 'vehicle'
			})
		],
		classic: [
			this.createImpact({
				id: 'wounded',
				label: 'IRONSWORN.DEBILITY.Wounded',
				icon: 'systems/foundry-ironsworn/assets/icons/impacts/wounded.svg',
				preventRecovery: 'system.health',
				category: 'conditions'
			}),
			this.createImpact({
				id: 'unprepared',
				label: 'IRONSWORN.DEBILITY.Unprepared',
				icon: 'systems/foundry-ironsworn/assets/icons/impacts/unprepared.svg',
				preventRecovery: 'system.supply',
				global: true,
				category: 'conditions'
			}),
			this.createImpact({
				id: 'shaken',
				label: 'IRONSWORN.DEBILITY.Shaken',
				icon: 'systems/foundry-ironsworn/assets/icons/impacts/shaken.svg',
				preventRecovery: 'system.spirit',
				category: 'conditions'
			}),
			this.createImpact({
				id: 'encumbered',
				icon: 'systems/foundry-ironsworn/assets/icons/impacts/encumbered.svg',
				label: 'IRONSWORN.DEBILITY.Encumbered',
				category: 'conditions'
			}),
			this.createImpact({
				id: 'maimed',
				icon: 'systems/foundry-ironsworn/assets/icons/impacts/permanentlyharmed.svg',
				label: 'IRONSWORN.DEBILITY.Maimed',
				category: 'banes'
			}),
			this.createImpact({
				id: 'corrupted',
				icon: 'systems/foundry-ironsworn/assets/icons/impacts/corrupted.svg',
				label: 'IRONSWORN.DEBILITY.Corrupted',
				category: 'banes'
			}),
			this.createImpact({
				id: 'cursed',
				icon: 'systems/foundry-ironsworn/assets/icons/impacts/doomed.svg',
				label: 'IRONSWORN.DEBILITY.Cursed',
				category: 'burdens'
			}),
			this.createImpact({
				id: 'tormented',
				icon: 'systems/foundry-ironsworn/assets/icons/impacts/tormented.svg',
				label: 'IRONSWORN.DEBILITY.Tormented',
				category: 'burdens'
			})
		]
	}
}

Hooks.on(
	'applyActiveEffect',
	/**
	 * Apply an ActiveEffect that uses a CUSTOM application mode.
	 * @param actor The actor the active effect is being applied to
	 * @param change The change data being applied
	 * @param current The current value being modified
	 * @param delta The parsed value of the change object
	 * @param changes An object which accumulates changes to be applied
	 */
	(
		actor: IronswornActor,
		change: EffectChangeData,
		current: boolean | string | number,
		delta: typeof current,
		changes: PartialDeep<typeof actor>
	) => {
		switch (change.key) {
			case 'system.momentumMax':
				if (typeof current !== 'number' || typeof delta !== 'number')
					throw new Error()
				changes[change.key] = clamp(
					current + delta,
					CharacterData.MOMENTUM_MIN,
					CharacterData.MOMENTUM_MAX
				)
				break
			case 'system.momentumReset':
				if (typeof current !== 'number' || typeof delta !== 'number')
					throw new Error()
				changes[change.key] = clamp(
					current + delta,
					CharacterData.MOMENTUM_RESET_MIN,
					CharacterData.MOMENTUM_MAX
				)
				break
			default:
				break
		}

		return changes
	}
)

declare global {
	interface FlagConfig {
		ActiveEffect: {
			'foundry-ironsworn': ImpactFlags & { type: 'impact' }
		}
	}
}
