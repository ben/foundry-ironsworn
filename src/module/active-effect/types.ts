declare global {
	export namespace foundry {
		export namespace data {
			export interface ActiveEffectDataProperties
				extends Required<ActiveEffectDataConstructorData> {
				statuses: Set<string>
			}
			export interface ActiveEffectData extends ActiveEffectDataProperties {}
		}
		export namespace documents {}
	}

	export interface ActiveEffect
		extends foundry.data.ActiveEffectDataProperties {
		name: string
	}

	export interface ActiveEffectDataConstructorData {
		/** @deprecated Since v11. Use `name` instead. */
		label?: string
		/** The name of the which describes the name of the ActiveEffect */
		name?: string
		/**
		 * Special status IDs that pertain to this effect
		 */
		statuses?: Set<string> | string[]
		/**
		 * The HTML text description for this ActiveEffect document.
		 */
		description?: string
	}
	export interface StatusEffect extends ActiveEffectDataConstructorData {}
}

export {}
