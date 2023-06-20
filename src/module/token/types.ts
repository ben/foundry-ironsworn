declare global {
	export interface TokenHUD<
		Options extends ApplicationOptions = ApplicationOptions
	> {}
	export namespace TokenHUD {
		export interface RenderOptions {
			canConfigure: boolean
			canToggleCombat: boolean
			displayBar1: string
			bar1Data: ReturnType<TokenDocument['getBarAttribute']>
			displayBar2: string
			bar2Data: ReturnType<TokenDocument['getBarAttribute']>
			visibilityClass: string
			effectsClass: string
			combatClass: string
			targetClass: string
			statusEffects: ReturnType<TokenHUD['_getStatusEffectChoices']>
		}
	}
}

export {}
