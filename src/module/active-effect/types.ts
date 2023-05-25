declare global {
	export namespace foundry {
		export namespace data {
			interface ActiveEffectDataConstructorData {
				name?: string
				/**
				 * Special status IDs that pertain to this effect
				 */
				statuses?: Set<string>
			}
			interface ActiveEffectDataProperties {
				name: string
				/**
				 * Special status IDs that pertain to this effect
				 */
				statuses: Set<string>
			}
			interface ActiveEffectData {
				name: string
				/**
				 * Special status IDs that pertain to this effect
				 */
				statuses: Set<string>
			}
		}
		export namespace documents {
			export interface ActiveEffect {
				name: string
				/**
				 * Special status IDs that pertain to this effect
				 */
				statuses: Set<string>
			}
		}
	}
}

export {}
