import type { ConfiguredDocumentClassForName } from '@league-of-foundry-developers/foundry-vtt-types/src/types/helperTypes'
import { ConfiguredDocumentClass } from '@league-of-foundry-developers/foundry-vtt-types/src/types/helperTypes'

declare global {
	/** A Collection of Compendium Folders
	 */
	class CompendiumFolderCollection extends DocumentCollection<
		ConfiguredDocumentClassForName<'Folder'>,
		'folders'
	> {
		/**
		 * The CompendiumPack instance which contains this CompendiumFolderCollection
		 */
		pack: Compendium<any, any>
	}
}
