import { DataswornTree } from '../datasworn2'
import type { IMove, IMoveCategory } from 'dataforged'
import { ISMoveCategories, SFMoveCategories } from '../dataforged/data'
import { IronswornSettings } from '../helpers/settings'
import type { IronswornItem } from '../item/item'
import { cachedDocumentsForPack, PackContents } from './pack-cache'
import type { Move, MoveCategory } from '@datasworn/core/dist/Datasworn'

export const DS_MOVE_COMPENDIUM_KEYS: Record<string, string> = {
	classic: 'foundry-ironsworn.ironswornmoves',
	delve: 'foundry-ironsworn.ironsworndelvemoves',
	starforged: 'foundry-ironsworn.starforgedmoves',
	sundered_isles: 'foundry-ironsworn.sunderedislesmoves'
}

export interface DisplayMoveRuleset {
	displayName: string
	categories: DisplayMoveCategory[]
}

export interface DisplayMoveCategory {
	color: string | null
	displayName: string
	moves: DisplayMove[]
	ds?: MoveCategory
	dataforgedCategory?: IMoveCategory
}

export interface DisplayMove {
	color: string | null
	displayName: string
	uuid: string
	ds?: Move
	dataforgedMove?: IMove
}

async function createMoveTree(
	categories: IMoveCategory[],
	...compendiumNames: string[]
): Promise<DisplayMoveCategory[]> {
	const ret = [] as DisplayMoveCategory[]

	// Make sure compendium is loaded
	const compendiumMoves: PackContents = []
	for (const compName of compendiumNames) {
		const compendium = await cachedDocumentsForPack(compName)
		if (compendium != null) {
			compendiumMoves.push(...compendium)
		}
	}

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

export async function createIronswornMoveTree(): Promise<
	DisplayMoveCategory[]
> {
	return await createMoveTree(
		ISMoveCategories,
		'foundry-ironsworn.ironswornmoves',
		'foundry-ironsworn.ironsworndelvemoves'
	)
}

export async function createStarforgedMoveTree(): Promise<
	DisplayMoveCategory[]
> {
	return await createMoveTree(
		SFMoveCategories,
		'foundry-ironsworn.starforgedmoves'
	)
}

const INDEXES: Record<string, any> = {}

export async function createMergedMoveTree(): Promise<DisplayMoveRuleset[]> {
	// Pre-load compendium indexes
	for (const rsName of IronswornSettings.enabledRulesets) {
		const compendiumKey = DS_MOVE_COMPENDIUM_KEYS[rsName]
		const pack = game.packs.get(compendiumKey)
		INDEXES[compendiumKey] ||= await pack?.getIndex({ fields: ['flags'] })
	}

	return await Promise.all(
		IronswornSettings.enabledRulesets.map(async (rsKey) => {
			const rs = DataswornTree.get(rsKey)
			const index = INDEXES[DS_MOVE_COMPENDIUM_KEYS[rsKey]]
			const categories = Object.values(rs?.moves ?? {})
			return {
				displayName: game.i18n.localize(`IRONSWORN.RULESETS.${rsKey}`),
				categories: categories.map((cat) => ({
					color: cat.color ?? MoveCategoryColor[cat.name] ?? null,
					displayName: game.i18n.localize(`IRONSWORN.MOVES.${cat.name}`),
					ds: cat,
					moves: Object.values(cat.contents).map((move) => {
						const indexEntry = index.contents.find(
							(x) => x.flags['foundry-ironsworn']?.dsid === move._id
						)
						return {
							color: move.color ?? null,
							displayName: move.name,
							uuid: indexEntry.uuid, // TODO: move.uuid
							ds: move
						}
					})
				}))
			}
		})
	)
}

// TODO dataforged has a key for move colours...., but they appear to have changed significantly since the last time i updated them! they'll be fixed for 2.0, but until then, here's a workaround.
export enum MoveCategoryColor {
	'Adventure Moves' = '#206087',
	'Combat Moves' = '#818992',
	'Connection Moves' = '#4A5791',
	// non-canonical (ironsworn); uses color from 'Exploration'
	'Delve Moves' = '#427FAA',
	'Exploration Moves' = '#427FAA',
	// non-canonical (ironsworn); uses color from 'Legacy'.
	'Failure Moves' = '#4F5A69',
	'Fate Moves' = '#8F477B',
	'Legacy Moves' = '#4F5A69',
	'Quest Moves' = '#805A90',
	// non-canonical (ironsworn); uses color from 'Recover'
	'Rarity Moves' = '#488B44',
	'Recover Moves' = '#488B44',
	// non-canonical (ironsworn); uses color from 'Connection'
	'Relationship Moves' = '#4A5791',
	'Scene Challenge' = '#206087',
	'Session Moves' = '#3F8C8A',
	'Suffer Moves' = '#883529',
	// non-canonical (ironsworn); uses color from 'Session'
	'Threat Moves' = '#3F8C8A',
	'Threshold Moves' = '#1D1D1B'
}

function walkCategory(
	category: IMoveCategory,
	compendiumMoves: Array<IronswornItem<'sfmove'>>
): DisplayMoveCategory {
	const newCategory: DisplayMoveCategory = {
		// FIXME: revert to pulling directly from DF when it's fixed in 2.0
		color: MoveCategoryColor[category.Name] ?? null,
		displayName: game.i18n.localize(`IRONSWORN.MOVES.${category.Name}`),
		dataforgedCategory: category,
		moves: [] as DisplayMove[]
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
				uuid: moveItem.uuid
			})
		} else {
			console.warn(`Couldn't find item for move ${move.$id}`)
		}
	}

	return newCategory
}

async function augmentWithFolderContents(categories: DisplayMoveCategory[]) {
	const name = game.i18n.localize('IRONSWORN.MOVES.Custom')
	const folder = (game.items?.directory as any)?.folders.find(
		(x) => x.name === name
	) as Folder | undefined
	if (folder == null || folder.contents.length == 0) return

	// @ts-expect-error Exists only in FVTT v10 API
	const color = (folder.color ?? null) as string | null

	const customMoves = [] as DisplayMove[]
	for (const moveItem of folder.contents) {
		if (moveItem.documentName !== 'Item' || !moveItem.assert('sfmove')) continue
		customMoves.push({
			color,
			displayName: moveItem.name ?? '(move)',
			uuid: moveItem.uuid
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
