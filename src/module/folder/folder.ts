import type { FolderData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/module.mjs'
import { compact } from 'lodash-es'
import type { DataforgedNamespace } from '../roll-table/oracle-tree'
import type { FolderableDocument } from './folder-types'

// @ts-expect-error IDFK you want from me, typescript. IronFolder<T> should be a valid narrowing of Folder :(
export class IronFolder<
	T extends FolderableDocument = FolderableDocument
> extends Folder {
	get img() {
		return this.dataforged?.Display?.Icon
	}

	get setting() {
		if (this.dfid == null) return undefined
		return this.dfid.split('/')[0] as DataforgedNamespace
	}

	/** The Dataforged ID of the node represented by this folder, if any */
	get dfid() {
		return this.getFlag('foundry-ironsworn', 'dfid')
	}

	get parentDfid() {
		if (!this.dfid) return
		return this.dfid.split('/').slice(0, -1).join('/')
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
