import type { CONST } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/module.mjs'
import type { ConfiguredDocumentClassForName } from '@league-of-foundry-developers/foundry-vtt-types/src/types/helperTypes'

type FolderDocumentClass =
	ConfiguredDocumentClassForName<CONST.FOLDER_DOCUMENT_TYPES>
type FolderDocument = InstanceType<FolderDocumentClass>

/** Extends FVTT's Folder document with system-specific functionality. */
export class IronFolder<
	DocType extends FolderDocument = FolderDocument
> extends Folder {}

export interface IronFolder<DocType extends FolderDocument = FolderDocument>
	extends Folder {
	type: DocType['documentName']
	folder: this | null
	children: this[]
	get contents(): Array<
		InstanceType<ConfiguredDocumentClassForName<this['type']>> & DocType
	>
	get ancestors(): this[]
	getSubfolders(recursive?: boolean): this[]
	getParentFolders(): this[]
}

export namespace IronFolder {}
