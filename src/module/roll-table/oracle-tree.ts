import type {
	GameDataRoot,
	IOracleBase,
	IOracleCategory,
	RequireKey
} from 'dataforged'
import { hash, hashLookup, pickDataforged } from '../dataforged'
import type {
	IOracleBranch,
	IOracleCategoryBranch,
	IOracleLeaf
} from './roll-table-types'
import { OracleTable } from './oracle-table'
import { IronFolder } from '../folder/folder'
import { compact, pickBy } from 'lodash-es'
import type { helpers } from '../../types/utils'
import { ISOracleCategories, SFOracleCategories } from '../dataforged/data'
import type { ConfiguredFlags } from '@league-of-foundry-developers/foundry-vtt-types/src/types/helperTypes'
import { FolderDataConstructorData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/folderData'
import { RollTableDataConstructorData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/rollTableData'

export type DataforgedNamespace = 'Starforged' | 'Ironsworn'

interface OracleTableIndexEntry {
	_id: string
	name: string
	flags: { 'foundry-ironsworn'?: { dfid?: string } }
}

/**
 * Extends FVTT's {@link RollTables} to manage the Dataforged oracle tree.
 * @remarks This is a singleton at runtime, but it intentionally implements its Ironsworn-specific static methods so that they're available as (e.g.) `OracleTree.findDfId()` instead of `game.tables?.findDfId()`.
 */
export class OracleTree extends RollTables {
	static folderIndex = new foundry.utils.Collection<IronFolder>()

	/**
	 * Find an oracle tree node by its Dataforged ID.
	 * @param dfid The Dataforged ID to find.
	 * @param includeFolders Should {@link IronFolder} results be included?
	 */
	static find(
		dfid: string,
		includeFolders?: false
	): StoredDocument<OracleTable> | undefined
	static find(
		dfid: string,
		includeFolders: true
	): StoredDocument<OracleTree.Node> | undefined
	static find(
		dfid: string,
		includeFolders = false
	): StoredDocument<OracleTree.Node> | undefined {
		if (includeFolders) {
			if (game.folders == null)
				throw new Error('game.folders has not been initialized')
			const folder = game.folders.find(
				(folder) => folder.type === 'RollTable' && folder.dfid === dfid
			) as StoredDocument<IronFolder<OracleTable>>
			if (folder != null) return folder
		}

		if (game.tables == null)
			throw new Error('game.tables has not been initialized')
		return game.tables.find((tbl) => tbl.dfid === dfid)
	}

	static query(q: string, setting: DataforgedNamespace) {
		let pattern: RegExp | null
		try {
			pattern = new RegExp(q, 'i')
		} catch {
			pattern = null
		}
		if (q == null || pattern == null) return

		const results = new Set<OracleTree.Node>()
		// Walk the tree and test each name.
		// Force expanded on all parent nodes leading to a match
		// iterate tables first
		const queryNode = (node: OracleTree.Node) => {
			// console.log(node)
			if (node == null) return false
			if (![setting, undefined].includes(node.setting)) return false

			const matchableNames: string[] = []

			const df = node.dataforged as { Aliases?: string[] }

			if (df?.Aliases != null) matchableNames.push(...df.Aliases)
			if (node.name != null) matchableNames.push(node.name)

			// console.log(namesToTest)

			if (!matchableNames.some((alias) => pattern?.test(alias))) return false

			results.add(node)

			for (const ancestor of node.ancestors) results.add(ancestor)

			if (node.documentName === 'Folder')
				for (const content of node.contents) results.add(content)

			return true
		}

		for (const node of game.tables ?? []) queryNode(node)
		for (const node of (game.folders ?? []) as IronFolder<OracleTable>[])
			queryNode(node)

		return Array.from(results).sort((a, b) => a.sort - b.sort)
	}

	/*********************************
	 * Dataforged adaption
	 *********************************/

	/** Paths to the JSON files with folder data */
	static readonly FOLDER_DATA_PATH = {
		Starforged:
			'systems/foundry-ironsworn/assets/folders/starforgedoracles.json',
		Ironsworn: 'systems/foundry-ironsworn/assets/folders/ironswornoracles.json'
	} as const

	static readonly CANONICAL_PACKS = {
		Ironsworn: ['foundry-ironsworn.ironswornoracles'],
		Starforged: ['foundry-ironsworn.starforgedoracles']
	}

	static async updateFolderData(noBuild = false) {
		const settings: DataforgedNamespace[] = ['Ironsworn', 'Starforged']
		if (!noBuild) await OracleTree.getConstructorData({})
		await Promise.all(
			settings.map(async (setting) => {
				const folders = game.folders?.filter(
					(folder) => folder.type === 'RollTable' && folder.canonical
				)
				if (!folders || folders.length === 0)
					throw new Error(`No canonical folders exist for the game ${setting}`)
				await OracleTree.saveFolders(
					folders,
					OracleTree.FOLDER_DATA_PATH[setting]
				)
			})
		)
	}

	/**
	 * Writes an oracle folder hierarchy to a JSON file so that it can later be rehydrated as a folder tree.
	 * @remarks Part of a workaround for folders not being available in v10 compendia.
	 * @see OracleTree#loadFolders
	 * @internal
	 */
	static async saveFolders(folders: IronFolder[], fileName: string) {
		const data = folders.map((folder) =>
			pickBy(folder.toObject(), (v, k) => {
				const omitKeys = ['_stats', 'sorting']
				if (v == null) return false
				if (typeof v === 'string' && v.length === 0) return false
				if (omitKeys.includes(k)) return false
				return true
			})
		)

		saveDataToFile(JSON.stringify(data), 'text/json', fileName)

		logger.info(`Saved oracle folder tree to ${fileName}`)
	}

	/**
	 * Loads the oracle category hierarchy as a tree of {@link IronFolder}s.
	 * @remarks Part of a workaround for folders not being available in v10 compendia.
	 * @see OracleTree#saveFolders
	 * @internal
	 */
	static async loadFolders(setting: DataforgedNamespace) {
		const path = OracleTree.FOLDER_DATA_PATH[setting]
		let branches: helpers.SourceDataType<IronFolder>[]
		let folders: StoredDocument<IronFolder<OracleTable>>[]
		logger.info(`Loading oracle tree from ${path}`)
		try {
			branches = (await (
				await fetch(path)
			).json()) as helpers.SourceDataType<IronFolder>[]

			folders = (await IronFolder.createDocuments(branches, {
				keepId: true,
				keepEmbeddedIds: true,
				temporary: true
			})) as StoredDocument<IronFolder<OracleTable>>[]
		} catch {
			throw new Error(`Couldn't load oracle folder tree from ${path}`)
		}
		const folderUpdates: Parameters<(typeof IronFolder)['updateDocuments']>[0] =
			[]

		// TODO: figure out the best way to apply this -- does it even work in a
		for await (const folder of folders) {
			if (!folder.dfid) throw new Error('Folder is missing a dataforged id')
			const [_namespace, _type, _topLevelCategory, ...parts] =
				folder.dfid.split('/')
			if (!parts || parts.length === 0) continue
			const parentDfid = folder.dfid.split('/').slice(0, -1).join('/')
			folderUpdates.push({ _id: folder.id, folder: hashLookup(parentDfid) })
		}

		await IronFolder.updateDocuments(folderUpdates)

		logger.info(`Loaded and rebuilt oracle tree from ${path}`)
		return folders
	}

	/**
	 * Load a Dataforged JSON file containing oracle tree data. The deserialized JSON's schema must conform to {@link GameDataRoot}, or else an array of {@link IOracleCategory}
	 * @returns
	 */
	static async loadDataforged(url: string) {
		const json = (await foundry.utils.fetchJsonWithTimeout(url, {
			method: 'GET'
		})) as GameDataRoot | IOracleCategory[]

		// node_modules/dataforged/dist/starforged/oracles.json
		// node_modules/dataforged/dist/ironsworn/oracles.json

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
		return categories
	}

	static getConstructorData(branches: IOracleBranch[]) {
		let results: ReturnType<(typeof OracleTree)['getBranchConstructorData']> = {
			tables: [],
			folders: []
		}

		for (const branch of branches) {
			if (!OracleTree.isBranch(branch) && !OracleTree.isCategoryBranch(branch))
				throw new Error(
					`Dataforged ID "${branch.$id}" doesn't appear to be a valid oracle branch.`
				)
			results = OracleTree.getBranchConstructorData(branch, results)
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
				dfid: oracleBranch.$id,
				parentDfid
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

		if (OracleTree.isBranch(oracleBranch))
			flags['foundry-ironsworn'].dataforged = pickDataforged(
				oracleBranch,
				'Display',
				'Source',
				'Aliases',
				'Usage'
			)
		else if (OracleTree.isCategoryBranch(oracleBranch))
			flags['foundry-ironsworn'].dataforged = pickDataforged(
				oracleBranch,
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
			setProperty(flags, `foundry-ironsworn.dataforged.${key}`, undefined)
		)

		if (flags['foundry-ironsworn'].dataforged?.Display.Images != null) {
			flags['foundry-ironsworn'].dataforged.Display.Images = flags[
				'foundry-ironsworn'
			].dataforged.Display.Images.map((img) =>
				img
					.replace(
						/^.*img\/raster\/webp\/planet\//,
						'systems/foundry-ironsworn/assets/planets/'
					)
					.toLowerCase()
			)
		}

		if (flags['foundry-ironsworn'].dataforged?.Display.Icon != null) {
			flags['foundry-ironsworn'].dataforged.Display.Icon = flags[
				'foundry-ironsworn'
			].dataforged.Display.Icon.replace(
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
			parent: parentFolder
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
			tables: RollTableDataConstructorData[]
		} = { folders: [], tables: [] }
	) {
		const folderData = OracleTree.getFolderConstructorData(branch)

		results.folders.push(folderData)
		// OracleTree.folderIndex.set(branch.$id, folder)

		const folderChildOptions: Partial<
			helpers.ConstructorDataType<Folder['data']>
		> = { parent: folderData._id as string }

		const heritableKeys = [
			'flags.foundry-ironsworn.dataforged.Display.Icon',
			'flags.foundry-ironsworn.dataforged.Source',
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
			if (OracleTree.isBranch(child) || OracleTree.isCategoryBranch(child))
				results = OracleTree.getBranchConstructorData(
					mergeObject(child, folderChildOptions, { inplace: false }),
					results
				)
			else if (OracleTree.isLeaf(child)) {
				const tableChild = OracleTable.getConstructorData(child)
				const heritableKeyMap: Record<string, string> = {
					img: 'flags.foundry-ironsworn.Display.Icon',
					'flags.foundry-ironsworn.dataforged.Source':
						'flags.foundry-ironsworn.dataforged.Source'
				}

				for (const [newKey, oldKey] of Object.entries(heritableKeyMap)) {
					if (!hasProperty(child, newKey)) {
						const value = getProperty(folderData, oldKey)
						setProperty(child, newKey, value)
					}
				}

				results.tables.push(tableChild)
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
