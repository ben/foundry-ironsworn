import type EmbeddedCollection from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/abstract/embedded-collection.mjs'
import type { OracleTableResult } from './oracle-table-result'
import type { OracleTable } from './oracle-table'
import type {
	RollTableData,
	TableResultData
} from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/module.mjs'

// Ironsworn-specific augmentations

/**
 * Used in some migrations and Vue components
 * @deprecated
 */
export interface LegacyTableRow {
	low: number
	high: number
	description?: string
	text?: string
	selected?: boolean
}

/** "Fake" types used to distinguish certain kinds of computed OracleTableResults. They're set in OracleTableResult#flags['foundry-ironsworn'].type */
export type ComputedTableResultType =
	| 'delve-site-denizen'
	| 'delve-site-feature'
	| 'delve-site-danger'
	| 'truth-option'
	| 'truth-option-subtable-result'
/** "Fake" types used to distinguish certain kinds of computed OracleTables. They're set in OracleTable#flags['foundry-ironsworn'].type */
export type ComputedTableType =
	| 'delve-site-denizens'
	| 'delve-site-features'
	| 'delve-site-dangers'
	| 'truth-options'
	| 'truth-option-subtable'

declare global {
	interface FlagConfig {
		RollTable: {
			'foundry-ironsworn'?: {
				/** The UUID of the originating document, for computed RollTables */
				sourceId?: Actor['uuid'] | Item['uuid'] | null | undefined
				type?: ComputedTableType
				/** A subtitle to be included in smaller text above a chat message's header. Standard oracles default to displaying their category flag, so they don't need to set this unless an override is needed.
				 */
				subtitle?: string | null | undefined
				/** The Dataforged ID associated with this oracle. */
				dfid?: string
				/** The Datasworn 2 ID associated with this oracle. */
				dsid?: string
				/** The category associated with the Dataforged oracle. */
				category?: string
			}
		}
		TableResult: {
			'foundry-ironsworn'?: {
				/** The UUID of the originating document, for computed TableResults */
				sourceId?: Actor['uuid'] | Item['uuid'] | null | undefined
				type?: ComputedTableResultType
			}
		}
	}

	interface BaseRollTable {
		get results(): EmbeddedCollection<
			CONFIG['TableResult']['documentClass'],
			foundry.data.RollTableData
		>
	}
	interface DocumentClassConfig {
		TableResult: typeof OracleTableResult
		RollTable: typeof OracleTable
	}

	interface RollTableDraw {
		roll: Roll
		results: Array<InstanceType<CONFIG['TableResult']['documentClass']>>
	}
}

// Augmentations to fix stuff missing from LoFD types
declare global {
	// fixes numerous missing properties caused by LoFD types having inheritance chains inconsistent with FVTT's source code
	interface TableResult
		extends Omit<
			TableResultData,
			'_initialize' | 'toJSON' | 'update' | 'toObject' | 'collection'
		> {}
	interface RollTable
		extends Omit<
			RollTableData,
			| 'update'
			| 'toObject'
			| 'toJSON'
			| 'results'
			| 'permission'
			| 'name'
			| 'folder'
		> {}
}
