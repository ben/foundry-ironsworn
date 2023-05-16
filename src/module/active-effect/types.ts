import { CONST } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/module.mjs'
import { IAssetAbility } from 'dataforged'

export type ActiveEffectType = 'asset-ability' | 'impact'

// type AssetAbilityFlags = {
// 	dfid: string
// 	type: Extract<ActiveEffectType, 'asset-ability'>
// } & Pick<IAssetAbility, 'Text' | 'Inputs'>

/** We start these at 100 to avoid collision with future FVTT updates */
export const enum IronActiveEffectMode {
	Momentum = 100
}

interface ImpactFlags {
	type: Extract<ActiveEffectType, 'impact'>
}

declare global {
	interface FlagConfig {
		ActiveEffect: {
			'foundry-ironsworn'?: // AssetAbilityFlags |
			ImpactFlags
		}
	}
	interface EffectChangeData {
		mode: CONST.ACTIVE_EFFECT_MODES | IronActiveEffectMode
	}
}
