import { IronswornSettings } from '../helpers/settings'
import { IronActiveEffect } from './active-effect'
import type { DebilityCategoryClassic, ImpactCategoryStarforged } from './types'

export interface ImpactFlags {
	/**
	 * Some impacts, like Wounded, prevent recovery of a specific player resource. Include an actor path to the bar attribute in question (e.g. `system.health`) if this is desired.
	 */
	noRecover?: string
	global?: boolean
	globalHint?: boolean
	/**
	 * A value for the `foundry-ironsworn.category` flag.
	 */
	category?: DebilityCategoryClassic | ImpactCategoryStarforged
	type?: 'impact'
	ruleset?: 'classic' | 'starforged'
	isCustomImpact?: boolean
}

export type IronActiveEffectFlags = ImpactFlags

declare global {
	interface FlagConfig {
		ActiveEffect: {
			'foundry-ironsworn'?: IronActiveEffectFlags
		}
	}
}

type ActiveEffectConfigV9 = (typeof CONFIG)['ActiveEffect']

interface ActiveEffectConfigV11 extends ActiveEffectConfigV9 {
	/**
	 * If true, Active Effects on Items will be copied to the Actor when the Item is created on the Actor if the
	 * Active Effect's transfer property is true, and will be deleted when that Item is deleted from the Actor.
	 * If false, Active Effects are never copied to the Actor, but will still apply to the Actor from within the Item
	 * if the transfer property on the Active Effect is true.
	 */
	legacyTransferral: boolean

	/** FVTT doesn't use this by default, but some of our stuff does; it's stored here so it's consistent with other document config objects */
	typeIcons: Record<IronActiveEffectFlags['type'] & string, string>
	/** FVTT doesn't use this by default, but some of our stuff does; it's stored here so it's consistent with other document config objects */
	typeLabels: Record<IronActiveEffectFlags['type'] & string, string>
}

export const ConfigActiveEffect: ActiveEffectConfigV11 = {
	documentClass: IronActiveEffect,
	legacyTransferral: false,
	typeIcons: {
		impact: 'fa-solid fa-angles-down'
	},
	typeLabels: {
		get impact() {
			return `IRONSWORN.${IronswornSettings.impactTypeDefault.capitalize()}`
		}
	}
}

export {}
