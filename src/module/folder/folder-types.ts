import type { FOLDER_DOCUMENT_TYPES } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/constants.mjs'
import type { ConfiguredDocumentClassForName } from '@league-of-foundry-developers/foundry-vtt-types/src/types/helperTypes'
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
				/**
				 * Does this folder represent a canonical category?
				 */
				canonical?: boolean
			}
		}
	}
	interface DocumentClassConfig {
		Folder: typeof IronFolder
	}
}

export {}
