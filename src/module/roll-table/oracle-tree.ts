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
import type { IronFolder } from '../folder/folder'
import { compact, pickBy } from 'lodash-es'
import type { helpers } from '../../types/utils'
import { ISOracleCategories, SFOracleCategories } from '../dataforged/data'
import type {
	ConfiguredDocumentClassForName,
	ConfiguredFlags
} from '@league-of-foundry-developers/foundry-vtt-types/src/types/helperTypes'
import type { FolderDataConstructorData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/folderData'
import type { RollTableDataConstructorData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/rollTableData'
import { deleteEmptyPackFolders, emptyPack } from '../dataforged/pack'
import { FolderableDocument } from '../folder/folder-types'

export type DataforgedNamespace = 'Starforged' | 'Ironsworn'

interface OracleTableIndexEntry {
	_id: string
	name: string
	flags: { 'foundry-ironsworn'?: { dfid?: string } }
}

/**
 * Extends FVTT's {@link RollTables} to manage the Dataforged oracle tree.
 * @remarks This is a singleton at runtime, but it intentionally implements its Ironsworn-specific static methods so that they're available as (e.g.) `OracleTree.find()` instead of `game.tables?.find()`.
 */
export class OracleTree extends RollTables {
	/**
	 * Render an import dialog for updating the data related to this Document through an exported JSON file
	 * @param packId The pack to rebuild with this data.
	 * @param sourcePattern An optional regular expressiong, tested against the flag `dataforged.Source.Title`
	 * @remarks Based on ClientDocumentMixin#importFromJSONDialog
	 */
	static async importFromDataforgedDialog(
		packId: string = 'foundry-ironsworn.starforgedoracles',
		sourcePattern: RegExp | undefined = undefined
	) {
		new Dialog(
			{
				title: `Import Dataforged v1 oracles`,
				content: await renderTemplate('templates/apps/import-data.html', {
					hint1: 'Choose a JSON file containing Dataforged v1 oracle data.',
					hint2: `This will <strong>completely replace</strong> the contents of the pack: ${packId}`
				}),
				buttons: {
					import: {
						icon: '<i class="fas fa-file-import"></i>',
						label: 'Import',
						callback: async (html) => {
							const form = (html as JQuery<HTMLElement>).find('form')[0]
							if (!form.data.files.length) {
								ui.notifications?.error('You did not upload a data file!')
								return
							}
							const json = await OracleTree.readDataforged(
								await readTextFromFile(form.data.files[0])
							)
							const ctorData = OracleTree.getConstructorData(json)

							const pack = game.packs.get(packId)
							if (pack == null) throw new Error()
							await pack.configure({ locked: false, sorting: 'm' })

							await emptyPack(pack)

							const folders = await getDocumentClass('Folder').createDocuments(
								ctorData.folders,
								{ pack: pack.metadata.id, keepEmbeddedIds: true, keepId: true }
							)

							if (sourcePattern != null)
								ctorData.tables = ctorData.tables.filter((table) =>
									sourcePattern.test(
										table.flags?.['foundry-ironsworn']?.dataforged?.Source
											.Title as string
									)
								)

							const oracles = await getDocumentClass(
								'RollTable'
							).createDocuments(ctorData.tables, {
								pack: pack.metadata.id,
								keepEmbeddedIds: true,
								keepId: true
							})

							for await (const oracle of oracles) {
								await oracle.update({
									folder: hash(oracle.parentDfid as string)
								})
							}

							await deleteEmptyPackFolders(pack)

							await pack.configure({ locked: true })
						}
					},
					no: {
						icon: '<i class="fas fa-times"></i>',
						label: 'Cancel'
					}
				},
				default: 'import'
			},
			{
				width: 400
			}
		).render(true)
	}

	/**
	 * Find an oracle tree node by its Dataforged ID.
	 * @param dfid The Dataforged ID to find.
	 * @param includeFolders Should {@link IronFolder} results be included?
	 */
	static async find(
		dfid: string,
		includeFolders?: false
	): Promise<StoredDocument<OracleTable> | undefined>
	static async find(
		dfid: string,
		includeFolders: true
	): Promise<StoredDocument<OracleTree.Node> | undefined>
	static async find(
		dfid: string,
		includeFolders = false
	): Promise<StoredDocument<OracleTree.Node> | undefined> {
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
				(tbl) => tbl.flags?.['foundry-ironsworn']?.dfid === dfid
			)
			if (found != null)
				return (await pack.getDocument(
					found._id
				)) as StoredDocument<OracleTable>
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
		return categories as IOracleBranch[]
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
