import type { IMove } from 'dataforged'
import type { IronswornItem } from '../item/item'
import { cachedDocumentsForPack } from '../features/pack-cache'
import { SFMoveCategories } from './data'
import { hashLookup } from './import'

export async function getFoundryMoveByDfId(
	dfid: string
): Promise<IronswornItem | undefined> {
	const sfDocuments =
		(await cachedDocumentsForPack('foundry-ironsworn.starforgedmoves')) ?? []
	const isDocuments =
		(await cachedDocumentsForPack('foundry-ironsworn.ironswornmoves')) ?? []
	return [...sfDocuments, ...isDocuments]?.find(
		(x) => x.id === hashLookup(dfid)
	) as IronswornItem | undefined
}

export async function getDFMoveByDfId(
	dfid: string
): Promise<IMove | undefined> {
	for (const category of SFMoveCategories) {
		for (const move of category.Moves) {
			if (move.$id === dfid) return move
		}
	}
	return undefined
}
