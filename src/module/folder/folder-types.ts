import type {
	COMPENDIUM_DOCUMENT_TYPES,
	FOLDER_DOCUMENT_TYPES
} from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/constants.mjs'
import type { ConfiguredDocumentClassForName } from '@league-of-foundry-developers/foundry-vtt-types/src/types/helperTypes'
import type { IAssetType, IMoveCategory } from 'dataforged'
import type { DataforgedFlags } from '../dataforged'
import type {
	IOracleBranch,
	IOracleCategoryBranch
} from '../roll-table/roll-table-types'
import type { IronFolder } from './folder'

export type FolderableDocument = InstanceType<
	ConfiguredDocumentClassForName<FOLDER_DOCUMENT_TYPES>
>
export type PackableDocument = InstanceType<
	ConfiguredDocumentClassForName<COMPENDIUM_DOCUMENT_TYPES>
>

interface FolderFlagsBase {
	forceExpanded?: boolean
}

type OracleBranchFlags = FolderFlagsBase &
	(
		| DataforgedFlags<
				IOracleCategoryBranch,
				'$id' | 'Display' | 'Source' | 'Aliases' | 'Usage' | 'Sample Names'
		  >
		| DataforgedFlags<
				IOracleBranch,
				'$id' | 'Display' | 'Source' | 'Aliases' | 'Usage'
		  >
	)

type MoveCategoryFlags = FolderFlagsBase &
	DataforgedFlags<IMoveCategory, '$id' | 'Display' | 'Source'>

type AssetTypeFlags = FolderFlagsBase &
	DataforgedFlags<IAssetType, '$id' | 'Display' | 'Source'>

declare global {
	interface Folder<T extends FolderableDocument = FolderableDocument> {
		/**
		 * An array of other Folders which are the displayed children of this one. This differs from the results of
		 * {@link Folder.getSubfolders} because reports the subset of child folders which  are displayed to the current User
		 * in the UI.
		 */
		get children(): Folder<T>[]

		/**
		 * Return the list of ancestors of this folder, starting with the parent.
		 */
		get ancestors(): Folder<T>[]
	}
	interface FlagConfig {
		Folder: {
			'foundry-ironsworn'?:
				| OracleBranchFlags
				| MoveCategoryFlags
				| AssetTypeFlags
		}
	}
	interface DocumentClassConfig {
		Folder: typeof IronFolder
	}
}

export {}
