import type { FolderData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/module.mjs'
import { compact } from 'lodash-es'
import type { DataforgedNamespace } from '../roll-table/oracle-tree'
import type { FolderableDocument } from './folder-types'

// @ts-expect-error IDFK you want from me, typescript. IronFolder<T> should be a valid narrowing of Folder
export class IronFolder<
	T extends FolderableDocument = FolderableDocument
> extends Folder {
	get ancestors() {
		const ancestors: (IronFolder<T> | null)[] = []
		// eslint-disable-next-line @typescript-eslint/no-this-alias
		// if (this.parentFolder == null) return ancestors

		ancestors.push(this.folder)
		while (ancestors.length <= CONST.FOLDER_MAX_DEPTH && ancestors[0] != null)
			ancestors.unshift(ancestors[0].folder)

		return compact(ancestors)
	}

	get img() {
		return this.dataforged?.Display?.Icon
	}

	get setting() {
		if (this.dfid == null) return undefined
		return this.dfid.split('/')[0] as DataforgedNamespace
	}

	get canonical() {
		return Boolean(this.getFlag('foundry-ironsworn', 'canonical'))
	}

	/** The Dataforged ID of the node represented by this folder, if any */
	get dfid() {
		return this.getFlag('foundry-ironsworn', 'dfid')
	}

	get dataforged() {
		return this.getFlag('foundry-ironsworn', 'dataforged')
	}
}

// @ts-expect-error
export interface IronFolder<T extends FolderableDocument = FolderableDocument>
	extends Folder {
	get parentFolder(): IronFolder<T> | null
	get folder(): IronFolder<T> | null
	get type(): T['documentName']

	data: FolderData & { type: T['documentName'] }
	sort: number

	getSubfolders: (recursive?: boolean) => IronFolder<T>[]
}
