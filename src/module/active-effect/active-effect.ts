import type { ActiveEffectDataConstructorData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/activeEffectData'
import type { IronswornActor } from '../actor/actor'
import type { EffectChangeData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/effectChangeData'
import type { PartialDeep } from 'dataforged'
import { CharacterData } from '../actor/config'
import { clamp } from 'lodash-es'

type ImpactOptions = ActiveEffectDataConstructorData & {
	preventRecover?: string
	global?: boolean
}

export class IronActiveEffect extends ActiveEffect {
	/**
	 * Create constructor data for an active effect that represents and impact/debility.
	 * @param label A name/label for the impact.
	 * @param preventRecover Some impacts, like Wounded, prevent recovery of a certain player resource. Include an actor path to the resource in question (e.g. `system.health`) if this is  desired.
	 */
	static createImpact({ label, icon, preventRecover, global }: ImpactOptions) {
		const result: ActiveEffectDataConstructorData = {
			label,
			icon,
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
				},
				...(preventRecover != null
					? [
							{
								key: preventRecover,
								mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
								value: '0'
							}
					  ]
					: [])
			],
			flags: {
				'foundry-ironsworn': {
					type: 'impact',
					global
				}
			}
		}
		return result
	}

	static starforgedImpacts: Record<
		string,
		Parameters<(typeof IronActiveEffect)['createImpact']>[0]
	> = {
		impact_wounded: {
			label: 'IRONSWORN.IMPACT.Wounded',
			preventRecover: 'system.health',
			icon: 'systems/foundry-ironsworn/assets/icons/impacts/wounded.svg'
		},
		impact_shaken: {
			label: 'IRONSWORN.IMPACT.Shaken',
			preventRecover: 'system.spirit',
			icon: 'systems/foundry-ironsworn/assets/icons/impacts/shaken.svg'
		},
		impact_unprepared: {
			label: 'IRONSWORN.IMPACT.Unprepared',
			preventRecover: 'system.supply',
			global: true,
			icon: 'systems/foundry-ironsworn/assets/icons/impacts/unprepared.svg'
		},
		impact_permanently_harmed: {
			label: 'IRONSWORN.IMPACT.Permanentlyharmed',
			icon: 'systems/foundry-ironsworn/assets/icons/impacts/permanently_harmed.svg'
		},
		impact_traumatized: {
			label: 'IRONSWORN.IMPACT.Traumatized',
			icon: 'systems/foundry-ironsworn/assets/icons/impacts/traumatized.svg'
		},
		impact_tormented: {
			label: 'IRONSWORN.IMPACT.Tormented',
			icon: 'systems/foundry-ironsworn/assets/icons/impacts/tormented.svg'
		},
		impact_doomed: {
			label: 'IRONSWORN.IMPACT.Doomed',
			icon: 'systems/foundry-ironsworn/assets/icons/impacts/doomed.svg'
		},
		impact_indebted: {
			label: 'IRONSWORN.IMPACT.Indebted',
			icon: 'systems/foundry-ironsworn/assets/icons/impacts/indebted.svg'
		},
		impact_cursed: {
			// vehicle impact
			label: 'IRONSWORN.IMPACT.Cursed',
			icon: 'systems/foundry-ironsworn/assets/icons/impacts/cursed_starforged.svg'
		},
		impact_battered: {
			// vehicle impact
			label: 'IRONSWORN.IMPACT.Battered',
			icon: 'systems/foundry-ironsworn/assets/icons/impacts/battered.svg'
		}
	}

	static classicDebilities: Record<
		string,
		Parameters<(typeof IronActiveEffect)['createImpact']>[0]
	> = {
		debility_wounded: {
			label: 'IRONSWORN.DEBILITY.Wounded',
			preventRecover: 'system.health',
			icon: 'systems/foundry-ironsworn/assets/icons/impacts/wounded.svg'
		},
		debility_unprepared: {
			label: 'IRONSWORN.DEBILITY.Unprepared',
			preventRecover: 'system.supply',
			global: true,
			icon: 'systems/foundry-ironsworn/assets/icons/impacts/unprepared.svg'
		},
		debility_shaken: {
			label: 'IRONSWORN.DEBILITY.Shaken',
			preventRecover: 'system.spirit',
			icon: 'systems/foundry-ironsworn/assets/icons/impacts/shaken.svg'
		},
		debility_encumbered: {
			label: 'IRONSWORN.DEBILITY.Encumbered',
			icon: 'systems/foundry-ironsworn/assets/icons/impacts/encumbered.svg'
		},
		debility_maimed: {
			label: 'IRONSWORN.DEBILITY.Maimed',
			icon: 'systems/foundry-ironsworn/assets/icons/impacts/permanently_harmed.svg'
		},
		debility_corrupted: {
			label: 'IRONSWORN.DEBILITY.Corrupted',
			icon: 'systems/foundry-ironsworn/assets/icons/impacts/corrupted.svg'
		},
		debility_cursed: {
			label: 'IRONSWORN.DEBILITY.Cursed',
			icon: 'systems/foundry-ironsworn/assets/icons/impacts/doomed.svg'
		},
		debility_tormented: {
			label: 'IRONSWORN.DEBILITY.Tormented',
			icon: 'systems/foundry-ironsworn/assets/icons/impacts/tormented.svg'
		}
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
			'foundry-ironsworn': {
				type?: 'impact'
				global?: boolean
			}
		}
	}
}
