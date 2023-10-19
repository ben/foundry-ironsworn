import type { FolderData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/module.mjs'
import type { FolderMetadata } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/documents.mjs/baseFolder'
import type { ConfiguredDocumentClassForName } from '@league-of-foundry-developers/foundry-vtt-types/src/types/helperTypes'

declare global {
	export interface FlagConfig {
		Folder: {
			'foundry-ironsworn'?: {
				/** The Dataforged ID associated with this folder. */
				dfid?: string
			}
		}
	}

	// Augmentations to fix stuff missing from LoFD types
	export namespace foundry {
		export namespace documents {
			export class BaseFolder extends Document<
				data.FolderData,
				BaseFolder,
				FolderMetadata
			> {}
		}
	}

	// fixes numerous missing properties caused by LoFD types having inheritance chains inconsistent with FVTT's source code
	export interface Folder
		extends Omit<
			FolderData,
			'update' | 'toObject' | 'toJSON' | 'type' | 'parent' | 'name'
		> {
		sort: number

		/** @deprecated Since v10. Use `folder` instead. */
		parent: this['folder']
		/** The parent Folder which contains this Folder */
		folder: InstanceType<ConfiguredDocumentClassForName<'Folder'>> | null
		type: this['data']['type']

		/**
		 * An array of other Folders which are the displayed children of this one. This differs from the results of
		 * {@link Folder.getSubfolders} because reports the subset of child folders which  are displayed to the current User
		 * in the UI.
		 */
		children: Array<InstanceType<ConfiguredDocumentClassForName<'Folder'>>>

		/**
		 * Return the list of ancestors of this folder, starting with the parent.
		 */
		get ancestors(): Array<
			InstanceType<ConfiguredDocumentClassForName<'Folder'>>
		>

		/**
		 * Export all Documents contained in this Folder to a given Compendium pack.
		 * Optionally update existing Documents within the Pack by name, otherwise append all new entries.
		 * @param pack - A Compendium pack to which the documents will be exported
		 * @param options - Additional options which customize how content is exported. See {@link ClientDocumentMixin#toCompendium}
		 * @param {boolean} [options.updateByName=false]    Update existing entries in the Compendium pack, matching by name
		 * @param {boolean} [options.keepId=false]          Retain the original _id attribute when updating an entity
		 * @param {boolean} [options.keepFolders=false]     Retain the existing Folder structure
		 * @param {string} [options.folder]                 A target folder id to which the documents will be exported
		 * @returns The updated Compendium Collection instance
		 */
		exportToCompendium<T extends this['type']>(
			pack: CompendiumCollection<CompendiumCollection.Metadata & { type: T }>,
			options?: {
				updateByName?: boolean
				keepId?: boolean
				keepFolders?: boolean
			}
		): Promise<
			CompendiumCollection<CompendiumCollection.Metadata & { type: T }>
		>

		/**
		 * Provide a dialog form that allows for exporting the contents of a Folder into an eligible Compendium pack.
		 * @param pack - A pack ID to set as the default choice in the select input
		 * @param options - Additional options passed to the Dialog.prompt method
		 * @returns A Promise which resolves or rejects once the dialog has been submitted or closed
		 */
		exportDialog(
			pack: string,
			options: Parameters<(typeof Dialog)['prompt']>[0]
		): Promise<void>

		/**
		 * Get the Folder documents which are sub-folders of the current folder, either direct children or recursively.
		 * @param recursive Identify child folders recursively, if false only direct children are returned (default: `false`)
		 * @returns An array of Folder documents which are subfolders of this one
		 */
		getSubfolders(
			recursive?: boolean
		): Array<InstanceType<ConfiguredDocumentClassForName<'Folder'>>>

		/**
		 * Get the Folder documents which are parent folders of the current folder or any if its parents.
		 * @returns An array of Folder documents which are parent folders of this one
		 */
		getParentFolders(): Array<
			InstanceType<ConfiguredDocumentClassForName<'Folder'>>
		>
	}
}

export {}
