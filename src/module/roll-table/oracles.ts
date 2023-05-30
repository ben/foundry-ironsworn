import type {
	GameDataRoot,
	IOracleBase,
	IOracleCategory,
	PartialDeep,
	RequireKey
} from 'dataforged'
import { hashLookup, pickDataforged } from '../dataforged'
import type {
	IOracleBranch,
	IOracleCategoryBranch,
	IOracleLeaf
} from './roll-table-types'
import { OracleTable } from './oracle-table'
import type { IronFolder } from '../folder/folder'
import { compact } from 'lodash-es'
import type { helpers } from '../../types/utils'
import type { ConfiguredFlags } from '@league-of-foundry-developers/foundry-vtt-types/src/types/helperTypes'
import type { FolderDataConstructorData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/folderData'
import type {
	RollTableDataConstructorData,
	RollTableDataProperties
} from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/rollTableData'
import { importFromDataforgedDialog } from '../dataforged/pack'
import type {
	FolderableDocument,
	PackableDocument
} from '../folder/folder-types'

export type DataforgedNamespace = 'Starforged' | 'Ironsworn'

export interface CompendiumTreeNode<
	TContents extends PackableDocument & FolderableDocument
> {
	children: CompendiumTreeNode<TContents>[]
	depth: number
	/** The index entries */
	entries: PartialDeep<TContents>[]
	root: boolean
	/** The folder that represents this node. `null` if `root` is `true` */
	folder: IronFolder<TContents>
	visible: boolean
}

export interface OracleIndexEntry
	extends Pick<
		RollTableDataProperties,
		| 'description'
		| 'flags'
		| 'folder'
		| 'formula'
		| 'img'
		| 'name'
		| 'sort'
		| '_id'
	> {
	/** e.g. "Compendium.foundry-ironsworn.delve-oracles.RollTable.aedcfc2f2a96a454" */
	uuid: string
}

/**
 * Extends FVTT's {@link RollTables} to manage the Dataforged oracle tree.
 * @remarks This is a singleton at runtime, but it intentionally implements its Ironsworn-specific functionality as static methods so that they're available as (e.g.) `Oracles.find()` instead of `game.tables?.find()`.
 */
export class Oracles extends RollTables {
	/**
	 * Render an import dialog for updating the data related to this Document through an exported JSON file
	 * @param packId The pack to rebuild with this data.
	 * @param sourcePattern An optional regular `expression, tested against the flag `Source.Title`. Use it to build only the content from a specific sourcebook.
	 */
	static async importFromDataforgedDialog(
		packId = 'foundry-ironsworn.starforgedoracles',
		sourcePattern: RegExp | undefined = undefined
	) {
		void importFromDataforgedDialog('RollTable', packId, async (json, _) => {
			const ctorData = Oracles.getConstructorData(
				await Oracles.readDataforged(json)
			)
			if (sourcePattern != null)
				ctorData.contents = ctorData.contents.filter((obj) =>
					sourcePattern.exec(
						obj.flags?.['foundry-ironsworn']?.Source?.Title as string
					)
				)
			return ctorData
		})
	}

	/**
	 * Find an oracle tree node by its Dataforged ID.
	 * @param dfid The Dataforged ID to find.
	 */
	static async find(
		dfid: string
	): Promise<StoredDocument<OracleTable> | undefined> {
		if (game.tables == null)
			throw new Error('game.tables has not been initialized')
		// try world collection first
		const syncTable = game.tables.find((tbl) => tbl.dfid === dfid)
		// table available in world collection -- return it
		if (syncTable != null) return syncTable
		// try oracle packs

		const oraclePacks = game.packs.filter(
			(pack) => pack.documentName === 'RollTable'
		)
		if (oraclePacks.length === 0) return undefined
		for await (const pack of oraclePacks) {
			const index = await pack.getIndex()
			const found = index.find(
				(tbl) =>
					(tbl.flags as ConfiguredFlags<'RollTable'>)?.['foundry-ironsworn']
						?.dfid === dfid
			)
			if (found != null)
				return (await pack.getDocument(
					found._id
				)) as StoredDocument<OracleTable>
		}
		return undefined
	}

	/**
	 * Synchronously find an oracle tree node by its Dataforged ID. If the node is only available in a pack, return its index entry instead.
	 * @see find
	 * @param dfid The Dataforged ID to find.
	 */
	static findSync(dfid: string) {
		if (game.tables == null)
			throw new Error('game.tables has not been initialized')
		// try world collection first
		const syncTable = game.tables.find((tbl) => tbl.dfid === dfid)
		// table available in world collection -- return it
		if (syncTable != null) return syncTable
		// try oracle packs

		const oraclePacks = game.packs.filter(
			(pack) => pack.documentName === 'RollTable'
		)
		if (oraclePacks.length === 0) return undefined

		for (const pack of oraclePacks) {
			const indexEntry = pack.index.find(
				(tbl) =>
					(tbl.flags as ConfiguredFlags<'RollTable'>)?.['foundry-ironsworn']
						?.dfid === dfid
			)
			if (indexEntry != null) return indexEntry
		}
		return undefined
	}

	/*********************************
	 * Dataforged adaption
	 *********************************/

	static readonly CANONICAL_PACKS = {
		Ironsworn: ['foundry-ironsworn.ironswornoracles'],
		Starforged: ['foundry-ironsworn.starforgedoracles']
	}

	/**
	 * Load a Dataforged JSON file containing oracle tree data as an array of objects. The deserialized JSON's schema must conform to {@link GameDataRoot}, or else an array of {@link IOracleCategory}
	 */
	static async readDataforged(data: string) {
		const json = JSON.parse(data) as GameDataRoot | IOracleCategory[]

		let categories: IOracleCategory[] | undefined
		if (Array.isArray(json)) {
			categories = json
		} else if (foundry.utils.hasProperty(json as object, 'Oracle Categories')) {
			categories = json['Oracle Categories']
		}
		if (categories == null)
			throw new Error(
				'The JSON root must either be a GameDataRoot object or an array of IOracleCategory'
			)
		return categories as IOracleBranch[]
	}

	static getConstructorData(branches: IOracleBranch[]) {
		let results: ReturnType<(typeof Oracles)['getBranchConstructorData']> = {
			contents: [],
			folders: []
		}

		for (const branch of branches) {
			if (!Oracles.isBranch(branch) && !Oracles.isCategoryBranch(branch))
				throw new Error(
					`Dataforged ID "${
						(branch as any).$id as string
					}" doesn't appear to be a valid oracle branch.`
				)
			results = Oracles.getBranchConstructorData(branch, results)
		}

		return results
	}

	/** Convert a Dataforged oracle tree branch into Folder source data.  */
	static getFolderConstructorData(
		oracleBranch: IOracleCategoryBranch | IOracleBranch
	): helpers.ConstructorDataType<Folder['data']> {
		const parentDfid = oracleBranch['Member of'] ?? oracleBranch.Category
		const parentFolder = parentDfid != null ? hashLookup(parentDfid) : null

		const flags: RequireKey<ConfiguredFlags<'Folder'>, 'foundry-ironsworn'> = {
			'foundry-ironsworn': {
				dfid: oracleBranch.$id
			}
		}

		// HACK: infer a page number if the category doesn't specify one
		// these won't be 100% correct but are good enough to provide a sensible sort order
		if (typeof oracleBranch.Source.Page === 'undefined') {
			const childPages = [
				...(oracleBranch.Categories ?? []),
				...(oracleBranch.Oracles ?? [])
			]
				.filter((child) => child.Source.Title === oracleBranch.Source.Title)
				.map((child) => child.Source.Page)
			// inference: lowest page is closest to start of category section
			oracleBranch.Source.Page = Math.min(...compact(childPages))
		}

		if (Oracles.isBranch(oracleBranch))
			flags['foundry-ironsworn'] = pickDataforged(
				oracleBranch,
				'$id',
				'Display',
				'Source',
				'Aliases',
				'Usage'
			)
		else if (Oracles.isCategoryBranch(oracleBranch))
			flags['foundry-ironsworn'] = pickDataforged(
				oracleBranch,
				'$id',
				'Display',
				'Source',
				'Aliases',
				'Usage',
				'Sample Names'
			)

		// strip unneeded/redundant flags
		const toStrip = [
			'Display.Title',
			'Display.Color',
			'Display.Table',
			'Source.Date'
		]
		toStrip.forEach((key) =>
			setProperty(flags, `foundry-ironsworn.${key}`, undefined)
		)

		if (flags['foundry-ironsworn']?.Display?.Images != null) {
			flags['foundry-ironsworn'].Display.Images = flags[
				'foundry-ironsworn'
			].Display?.Images.map((img) =>
				img
					.replace(
						/^.*img\/raster\/webp\/planet\//,
						'systems/foundry-ironsworn/assets/planets/'
					)
					.toLowerCase()
			)
		}

		if (flags['foundry-ironsworn']?.Display?.Icon != null) {
			flags['foundry-ironsworn'].Display.Icon = flags[
				'foundry-ironsworn'
			].Display.Icon.replace(
				/^.*img\/vector\/(Oracles\/)?/,
				'systems/foundry-ironsworn/assets/oracles/'
			).toLowerCase()
		}

		let sort: number = oracleBranch.Source.Page ?? 0

		// HACK: lazy way to bump delve content to the end. it'd be better to genericize this so it can gracefully handle future content
		if (oracleBranch.Source.Title === 'Ironsworn: Delve') sort += 1000

		// More specific/opinionated sorting
		switch (oracleBranch.$id) {
			case 'Starforged/Oracles/Core':
				sort = 1
				break
			case 'Starforged/Oracles/Vaults/Interior':
			case 'Starforged/Oracles/Vaults/Sanctum':
				sort += 10
				break
			case 'Starforged/Oracles/Moves':
			case 'Ironsworn/Oracles/Moves':
				sort += 2000
				break
			default:
				break
		}

		return {
			_id: hashLookup(oracleBranch.$id),
			// remove "Oracle XX: " from some classic oracle titles
			name: oracleBranch.Display.Title.replace(/^Oracle [0-9]+: /, ''),
			type: 'RollTable',
			description: oracleBranch.Description,
			sort,
			flags,
			color: oracleBranch.Display.Color,
			parent: parentFolder,
			sorting: 'm'
		}
	}

	/**
	 * Recursively transforms a branch of Dataforged's oracle tree in to FVTT constructor data. Nodes that conform to {@link IOracleBranch} or {@link IOracleCategoryBranch} are transformed into {@link FolderDataConstructorData}. Nodes that conform to {@link IOracleLeaf} are constructed as {@link RollTableDataConstructorData}.
	 *
	 * @return A keyed object containing constructor data for folders and tables.
	 */
	static getBranchConstructorData(
		branch: IOracleBranch | IOracleCategoryBranch,
		// options: Partial<FolderDataConstructorData> = {},
		results: {
			folders: FolderDataConstructorData[]
			contents: RollTableDataConstructorData[]
		} = { folders: [], contents: [] }
	) {
		const folderData = Oracles.getFolderConstructorData(branch)

		results.folders.push(folderData)
		// OracleTree.folderIndex.set(branch.$id, folder)

		const folderChildOptions: Partial<
			helpers.ConstructorDataType<Folder['data']>
		> = { parent: folderData._id as string }

		const heritableKeys = [
			'flags.foundry-ironsworn.Display.Icon',
			'flags.foundry-ironsworn.Source',
			'color'
		]

		for (const key of heritableKeys) {
			const value = getProperty(folderData, key)
			if (value && !hasProperty(folderChildOptions, key))
				setProperty(folderChildOptions, key, value)
		}

		const childrenData = [
			...(branch.Categories ?? []),
			...(branch.Oracles ?? [])
		]

		for (const child of childrenData) {
			if (Oracles.isBranch(child) || Oracles.isCategoryBranch(child))
				results = Oracles.getBranchConstructorData(
					mergeObject(child, folderChildOptions, { inplace: false }),
					results
				)
			else if (Oracles.isLeaf(child)) {
				const tableChild = OracleTable.getConstructorData(child)
				const heritableKeyMap: Record<string, string> = {
					img: 'flags.foundry-ironsworn.Display.Icon',
					'flags.foundry-ironsworn.Source': 'flags.foundry-ironsworn.Source'
				}

				for (const [newKey, oldKey] of Object.entries(heritableKeyMap)) {
					if (!hasProperty(child, newKey)) {
						const value = getProperty(folderData, oldKey)
						setProperty(child, newKey, value)
					}
				}

				results.contents.push(tableChild)
			}
		}

		return results
	}

	/*********************************
	 * Type guards
	 *********************************/

	/** Does this Dataforged oracle node contain categories? */
	static isCategoryBranch(
		oracle: IOracleBase
	): oracle is IOracleCategoryBranch {
		if (Array.isArray(oracle.Table)) return false
		return Array.isArray(oracle.Categories)
	}

	static isBranch(oracle: IOracleBase): oracle is IOracleBranch {
		if (Array.isArray(oracle.Table)) return false
		return Array.isArray(oracle.Oracles)
	}

	static isLeaf(oracle: IOracleBase): oracle is IOracleLeaf {
		return Array.isArray(oracle.Table)
	}
}

export namespace OracleTree {
	export interface BuildBranchOptions {
		branch: IOracleBranch | IOracleCategoryBranch
		mode?: 'omit-tables' | 'omit-folders' | 'all'
		folderOptions?: Partial<helpers.ConstructorDataType<Folder['data']>>
		folderContext?: DocumentModificationContext
		tableOptions?: Partial<helpers.ConstructorDataType<RollTable['data']>>
		tableContext?: DocumentModificationContext
	}
	export interface BuildTreeOptions extends Omit<BuildBranchOptions, 'branch'> {
		branches?: IOracleCategory[]
	}
	export type Node = IronFolder<OracleTable> | OracleTable
}
