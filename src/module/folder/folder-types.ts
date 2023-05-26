import type { FOLDER_DOCUMENT_TYPES } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/constants.mjs'
import { CONST } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/module.mjs'
import type {
	ConfiguredDocumentClassForName,
	ConfiguredFlags
} from '@league-of-foundry-developers/foundry-vtt-types/src/types/helperTypes'
import type { IAssetType, IHasId, IMoveCategory } from 'dataforged'
import type { DataforgedFlags, StripDollars } from '../dataforged'
import type {
	IOracleBranch,
	IOracleCategoryBranch
} from '../roll-table/roll-table-types'
import type { IronFolder } from './folder'

export type FolderableDocument = InstanceType<
	ConfiguredDocumentClassForName<FOLDER_DOCUMENT_TYPES>
>

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
			'foundry-ironsworn'?: {
				dfid?: string
				parentDfid?: string
				dataforged?:
					| DataforgedFlags<
							IOracleBranch,
							'Display' | 'Source' | 'Aliases' | 'Usage'
					  >
					| DataforgedFlags<
							IOracleCategoryBranch,
							'Display' | 'Source' | 'Aliases' | 'Usage' | 'Sample Names'
					  >
					| DataforgedFlags<IMoveCategory, 'Display' | 'Source'>
					| DataforgedFlags<IAssetType, 'Display' | 'Source'>
				forceExpanded?: boolean
			}
		}
	}
	interface DocumentClassConfig {
		Folder: typeof IronFolder
	}
}

export {}
