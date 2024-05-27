import type { IMove, IMoveCategory } from 'dataforged'
import { ISMoveCategories, SFMoveCategories } from '../dataforged/data'
import type { IronswornItem } from '../item/item'
import {
	dfMoveHasRollableOptions,
	moveHasRollableOptions
} from '../rolls/preroll-dialog'
import {
	findPathToNodeByDfId,
	getOracleTreeWithCustomOracles,
	IOracleTreeNode
} from './customoracles'
import { cachedDocumentsForPack } from './pack-cache'

export interface MoveCategory {
	color: string | null
	displayName: string
	moves: Move[]
	dataforgedCategory?: IMoveCategory
}

export interface Move {
	color: string | null
	displayName: string
	moveItem: () => IronswornItem<'sfmove'>
	dataforgedMove?: IMove
}

async function createMoveTree(
	compendiumName: string,
	categories: IMoveCategory[]
): Promise<MoveCategory[]> {
	const ret = [] as MoveCategory[]

	// Make sure compendium is loaded
	const compendiumMoves = await cachedDocumentsForPack(compendiumName)

	// Construct the base tree
	for (const category of categories) {
		ret.push(
			walkCategory(category, compendiumMoves as Array<IronswornItem<'sfmove'>>)
		)
	}

	// Add custom moves from well-known folder
	await augmentWithFolderContents(ret)

	// Fire the hook and allow extensions to modify the list
	await Hooks.call('ironswornMoves', ret)

	return ret
}

export async function createIronswornMoveTree(): Promise<MoveCategory[]> {
	return await createMoveTree(
		'foundry-ironsworn.ironswornmoves',
		ISMoveCategories
	)
}

export async function createStarforgedMoveTree(): Promise<MoveCategory[]> {
	return await createMoveTree(
		'foundry-ironsworn.starforgedmoves',
		SFMoveCategories
	)
}

// TODO dataforged has a key for move colours...., but they appear to have changed significantly since the last time i updated them! they'll be fixed for 2.0, but until then, here's a workaround.
export enum MoveCategoryColor {
	Adventure = '#206087',
	Combat = '#818992',
	Connection = '#4A5791',
	// non-canonical (ironsworn); uses color from 'Exploration'
	Delve = '#427FAA',
	Exploration = '#427FAA',
	// non-canonical (ironsworn); uses color from 'Legacy'.
	Failure = '#4F5A69',
	Fate = '#8F477B',
	Legacy = '#4F5A69',
	Quest = '#805A90',
	// non-canonical (ironsworn); uses color from 'Recover'
	Rarity = '#488B44',
	Recover = '#488B44',
	// non-canonical (ironsworn); uses color from 'Connection'
	Relationship = '#4A5791',
	'Scene Challenge' = '#206087',
	Session = '#3F8C8A',
	Suffer = '#883529',
	// non-canonical (ironsworn); uses color from 'Session'
	Threat = '#3F8C8A',
	Threshold = '#1D1D1B'
}

function walkCategory(
	category: IMoveCategory,
	compendiumMoves: Array<IronswornItem<'sfmove'>>
): MoveCategory {
	const newCategory: MoveCategory = {
		// FIXME: revert to pulling directly from DF when it's fixed in 2.0
		color: MoveCategoryColor[category.Name] ?? null,
		displayName: game.i18n.localize(`IRONSWORN.MOVES.${category.Name}`),
		dataforgedCategory: category,
		moves: [] as Move[]
	}

	for (const move of category.Moves) {
		const moveItem = compendiumMoves?.find((x) => x.system.dfid === move.$id)
		if (moveItem != null) {
			newCategory.moves.push({
				color: category.Display.Color ?? null,
				dataforgedMove: move,
				displayName:
					// TODO: ideally, alternate versions wouldn't have the same move at all! they'd be selectable within the move display. maybe a radio select, or expandable into its own tree? or displayed as a second text?
					// 'alternate version' gets too long for a single line in many cases, so it gets trimmed
					// move.Display.Title.replace(/alternate version/i, 'alt') ??
					moveItem.name as string,
				moveItem: () => moveItem
			})
		} else {
			console.warn(`Couldn't find item for move ${move.$id}`)
		}
	}

	return newCategory
}

async function augmentWithFolderContents(categories: MoveCategory[]) {
	const name = game.i18n.localize('IRONSWORN.MOVES.Custom')
	const folder = (game.items?.directory as any)?.folders.find(
		(x) => x.name === name
	) as Folder | undefined
	if (folder == null || folder.contents.length == 0) return

	// @ts-expect-error Exists only in FVTT v10 API
	const color = (folder.color ?? null) as string | null

	const customMoves = [] as Move[]
	for (const moveItem of folder.contents) {
		if (moveItem.documentName !== 'Item' || !moveItem.assert('sfmove')) continue
		customMoves.push({
			color,
			displayName: moveItem.name ?? '(move)',
			moveItem: () => moveItem
		})
	}

	if (customMoves.length > 0) {
		categories.push({
			color,
			displayName: name,
			moves: customMoves
		})
	}
}

/**
 * A version of this logic that works with compendium indexes instead of the actual items,
 * which should save on memory usage and speed up load times.
 */

export interface IndexedMoveCategory {
	color: string | null
	displayName: string
	moves: IndexedMove[]
	dataforgedCategory?: IMoveCategory
}

export interface IndexedMove {
	name: string
	uuid: string
	isRollable: boolean
	defaultOracleNode?: IOracleTreeNode
	triggerText?: string
	dfid?: string
	dataforgedMove?: IMove
}

async function createMoveIndexTree(
	compendiumName: string,
	categories: IMoveCategory[],
	oracleTree: IOracleTreeNode
): Promise<IndexedMoveCategory[]> {
	const pack = game.packs.get(compendiumName)
	if (pack == null) {
		ui.notifications?.error(`Couldn't find pack ${compendiumName}`)
		throw new Error(`Couldn't find pack ${compendiumName}`)
	}

	const index = await pack.getIndex({
		fields: [
			'system.dfid',
			'system.Category',
			'system.Trigger',
			'system.Oracles'
		]
	})

	const ret = [] as IndexedMoveCategory[]
	for (const category of categories) {
		ret.push(indexedMoveListForCategory(category, index, oracleTree))
	}

	// Add custom moves from folder
	const customMoveCategory = await indexedCustomMoveCategory(oracleTree)
	if (customMoveCategory !== undefined) {
		ret.push(customMoveCategory)
	}

	// TODO: call registered move-hooks so modules can modify the tree

	return ret
}

function defaultOracleNodeForMove(
	moveItem: IronswornItem<'sfmove'>,
	oracleTree: IOracleTreeNode
): IOracleTreeNode | undefined {
	if (moveItem.system.Oracles?.length !== 1) return undefined

	const oracleDfid = moveItem.system.Oracles[0]
	const oraclesInPath = findPathToNodeByDfId(oracleTree, oracleDfid)
	if (oraclesInPath.length > 0) {
		return oraclesInPath[oraclesInPath.length - 1]
	}

	return undefined
}

async function indexedCustomMoveCategory(
	oracleTree: IOracleTreeNode
): Promise<IndexedMoveCategory | undefined> {
	const name = game.i18n.localize('IRONSWORN.MOVES.Custom')
	const folder = (game.items?.directory as any)?.folders.find(
		(x) => x.name === name
	) as Folder | undefined
	if ((folder?.contents ?? []).length === 0) return undefined

	// @ts-expect-error Exists only in FVTT v10 API
	const color = (folder.color ?? null) as string | null
	const category: IndexedMoveCategory = {
		color,
		displayName: name,
		moves: []
	}

	for (const moveItem of folder.contents) {
		if (moveItem.documentName !== 'Item' || !moveItem.assert('sfmove')) continue
		category.moves.push({
			name: moveItem.name ?? '(move)',
			uuid: moveItem.uuid,
			isRollable: moveHasRollableOptions(moveItem),
			defaultOracleNode: defaultOracleNodeForMove(moveItem, oracleTree),
			triggerText: moveItem.system.Trigger?.Text
		})
	}

	return category.moves.length > 0 ? category : undefined
}

function indexedMoveListForCategory(
	category: IMoveCategory,
	index: IndexTypeForMetadata<CompendiumCollection.Metadata>,
	oracleTree: IOracleTreeNode
): IndexedMoveCategory {
	const newCategory: IndexedMoveCategory = {
		color: MoveCategoryColor[category.Name] ?? null,
		displayName: game.i18n.localize(`IRONSWORN.MOVES.${category.Name}`),
		dataforgedCategory: category,
		moves: [] as IndexedMove[]
	}

	for (const dfMove of category.Moves) {
		const moveItem = index.find((x) => x.system.dfid === dfMove.$id)
		if (moveItem != null) {
			newCategory.moves.push({
				dfid: dfMove.$id,
				uuid: moveItem.uuid,
				isRollable: dfMoveHasRollableOptions(dfMove),
				defaultOracleNode: defaultOracleNodeForMove(moveItem, oracleTree),
				triggerText: moveItem.system.Trigger?.Text,
				dataforgedMove: dfMove,
				name: moveItem.name
			})
		} else {
			console.warn(`Couldn't find item for move ${dfMove.$id}`)
		}
	}

	return newCategory
}

export async function createIndexedIronswornMoveTree(): Promise<
	IndexedMoveCategory[]
> {
	const oracleTree = await getOracleTreeWithCustomOracles('ironsworn')
	return await createMoveIndexTree(
		'foundry-ironsworn.ironswornmoves',
		ISMoveCategories,
		oracleTree
	)
}

export async function createIndexedStarforgedMoveTree(): Promise<
	IndexedMoveCategory[]
> {
	const oracleTree = await getOracleTreeWithCustomOracles('starforged')
	return await createMoveIndexTree(
		'foundry-ironsworn.starforgedmoves',
		SFMoveCategories,
		oracleTree
	)
}
