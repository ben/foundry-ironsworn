/* eslint-disable @typescript-eslint/no-namespace */
import type EmbeddedCollection from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/abstract/embedded-collection.mjs'
import type { OracleTableResult } from './oracle-table-result'
import type { OracleTable } from './oracle-table'
import type {
	RollTableData,
	TableResultData
} from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/module.mjs'
import type { Oracles } from './oracles'
import type { IOracle, IOracleCategory, IRow, RequireKey } from 'dataforged'
import type { helpers } from '../../types/utils'
import type { DataforgedFlags } from '../dataforged'

// Ironsworn-specific types & augmentations

/**
 * A Dataforged oracle category with a Categories property. In other words, it has {@link IOracleCategory} children.
 * @see {Oracles.isCategoryBranch} The corresponding type guard.
 */
export type IOracleCategoryBranch = RequireKey<IOracleCategory, 'Categories'>
/**
 * A Dataforged oracle with an Oracles property. In other words, it has {@link IOracle} children.
 * @see {Oracles.isBranch} The corresponding type guard.
 */
export type IOracleBranch = RequireKey<IOracleCategory | IOracle, 'Oracles'>
/**
 * A Dataforged oracle with a Table property, which is necessary to build a valid {@link OracleTable}.
 * @see {Oracles.isLeaf} The corresponding type guard method.
 */
export type IOracleLeaf = RequireKey<IOracle, 'Table'>

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

type OracleFlags = DataforgedFlags<
	IOracleLeaf,
	'$id' | 'Source' | 'Display' | 'Usage' | 'Aliases'
> & {
	/** The UUID of the originating document, for computed RollTables */
	sourceId?: Actor['uuid'] | Item['uuid'] | null | undefined
	type?: ComputedTableType
	/** A subtitle to be included in smaller text above a chat message's header. Standard oracles default to displaying their category flag, so they don't need to set this unless an override is needed.
	 */
	subtitle?: string | null | undefined
	forceExpanded?: boolean
}

type OracleRowFlags = DataforgedFlags<
	IRow,
	'$id' | 'Attributes' | 'Suggestions' | 'Game objects' | 'Oracle rolls'
> & {
	/** The UUID of the originating document, for computed TableResults */
	sourceId?: Actor['uuid'] | Item['uuid'] | null | undefined
	type?: ComputedTableResultType
}

declare global {
	interface FlagConfig {
		RollTable: {
			'foundry-ironsworn'?: OracleFlags
		}
		TableResult: {
			'foundry-ironsworn'?: OracleRowFlags
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
		RollTables: typeof Oracles
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
		> {
		documentCollection?: string
		documentId?: string
	}
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
		> {
		description: string
	}
	namespace RollTable {
		/**
		 * Perform follow-up operations when a set of Documents of this type are created.
		 * This is where side effects of creation should be implemented.
		 * Post-creation side effects are performed only for the client which requested the operation.
		 * @param documents - The Document instances which were created
		 * @param context  - The context for the modification operation
		 *
		 * @remarks The base implementation returns `void` but it is typed as
		 * `unknown` to allow deriving classes to return whatever they want. The
		 * return type is not meant to be used.
		 */
		function _onCreateDocuments<T extends typeof RollTable>(
			this: T,
			documents: Array<InstanceType<helpers.ConfiguredDocumentClass<T>>>,
			context: DocumentModificationContext
		): Promise<unknown>
	}
	// interface RollTableDirectory<
	// 	Options extends SidebarDirectory.Options = SidebarDirectory.Options
	// > extends SidebarDirectory<'RollTable', Options> {}
	// namespace RollTableDirectory {}
}
