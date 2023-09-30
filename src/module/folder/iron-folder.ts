import type { CONST } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/module.mjs'
import { ConfiguredDocumentClassForName } from '@league-of-foundry-developers/foundry-vtt-types/src/types/helperTypes'
import { ConfiguredDocumentClass } from '../../types/helperTypes'

/** Extends FVTT's Folder document with system-specific functionality. */
export class IronFolder<
	DocType extends CONST.FOLDER_DOCUMENT_TYPES = CONST.FOLDER_DOCUMENT_TYPES
> extends Folder {}

export interface IronFolder<
	DocType extends CONST.FOLDER_DOCUMENT_TYPES = CONST.FOLDER_DOCUMENT_TYPES
> extends Folder {
	type: DocType
	folder: this | null
	children: this[]
	get ancestors(): this[]

	getSubfolders(recursive?: boolean): this[]
	getParentFolders(): this[]
}

export namespace IronFolder {}
