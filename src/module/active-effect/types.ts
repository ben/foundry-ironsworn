import type {
	EffectChangeData,
	EffectChangeDataConstructorData
} from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/effectChangeData'
import type { EffectDurationDataConstructorData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/effectDurationData'
import type { ConfiguredFlags } from '@league-of-foundry-developers/foundry-vtt-types/src/types/helperTypes'
import type { ConfiguredDocumentClass } from '../../types/helperTypes'
import type { ImpactFlags } from './config'

export type ImpactCategoryStarforged = 'conditions' | 'banes' | 'burdens'
export type DebilityCategoryClassic =
	| 'misfortunes'
	| 'lastingEffects'
	| 'burdens'
	| 'vehicle'

export type ImpactOptions = StatusEffect & ImpactFlags

declare global {
	export interface DurationSummary {
		type: 'seconds' | 'turns' | 'none'
		duration: number | null
		remaining: number | null
		label: string
	}

	export interface ActiveEffectDataConstructorData {
		/**
		 * The _id which uniquely identifies the ActiveEffect within a parent Actor or Item
		 * @defaultValue `null`
		 */
		_id?: string | null | undefined
		/** @deprecated Since v11. Use `name` instead. */
		label?: string
		/** The name of the which describes the name of the ActiveEffect */
		name?: string
		/**
		 * The array of EffectChangeData objects which the ActiveEffect applies
		 * @defaultValue `[]`
		 */
		changes?: EffectChangeDataConstructorData[] | null | undefined

		/**
		 * Is this ActiveEffect currently disabled?
		 * @defaultValue `false`
		 */
		disabled?: boolean | null | undefined

		/** An EffectDurationData object which describes the duration of the ActiveEffect
		 * @defaultValue `new EffectDurationData({})`
		 */
		duration?: EffectDurationDataConstructorData | null | undefined

		/**
		 * The HTML text description for this ActiveEffect document.
		 */
		description?: string
		/** An icon image path used to depict the ActiveEffect */
		icon?: string
		/** A UUID reference to the document from which this ActiveEffect originated */
		origin?: string
		/** A color string which applies a tint to the ActiveEffect icon */
		tint?: string | null
		/** Does this ActiveEffect automatically transfer from an Item to an Actor? */
		transfer?: boolean
		/**
		 * Special status IDs that pertain to this effect
		 */
		statuses?: Set<string> | string[]
		flags?: ConfiguredFlags<'ActiveEffect'>
	}
	export interface StatusEffect extends ActiveEffectDataConstructorData {
		id: string
	}
	export namespace foundry {
		export namespace data {
			export interface ActiveEffectDataProperties
				extends Omit<Required<ActiveEffectDataConstructorData>, 'duration'> {
				/**
				 * An EffectDurationData object which describes the duration of the ActiveEffect
				 * @defaultValue `new EffectDurationData({})`
				 */
				duration: DurationSummary
				/**
				 * The array of EffectChangeData objects which the ActiveEffect applies
				 * @defaultValue `[]`
				 */
				changes: EffectChangeData[]

				statuses: Set<string>
			}
			export interface ActiveEffectData extends ActiveEffectDataProperties {}
		}
	}

	export interface ActiveEffect
		extends foundry.data.ActiveEffectDataProperties {
		name: string
		/**
		 * Provide forward-compatibility with other Document types which use img as their primary image or icon.
		 * We are likely to formally migrate this in the future, but for now this getter provides compatible read access.
		 */
		get img(): string
		/**
		 * Retrieve the Document that this ActiveEffect targets for modification.
		 */
		get target(): InstanceType<
			ConfiguredDocumentClass<typeof foundry.documents.BaseActor>
		> | null
		/**
		 * Whether the Active Effect currently applying its changes to the target.
		 */
		get active(): boolean
		/**
		 * Does this Active Effect currently modify an Actor?
		 */
		get modifiesActor(): boolean
	}
}

export {}
