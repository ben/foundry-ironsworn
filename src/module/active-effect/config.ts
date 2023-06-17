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
}

export type IronActiveEffectFlags = ImpactFlags

declare global {
	interface FlagConfig {
		ActiveEffect: {
			'foundry-ironsworn'?: IronActiveEffectFlags
		}
	}
}

export {}
