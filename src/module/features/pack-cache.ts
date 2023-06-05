import type { BaseAdventure } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/documents.mjs/baseAdventure.js'
import type { IronswornActor } from '../actor/actor'
import type { IronswornItem } from '../item/item'
import type { IronswornJournalEntry } from '../journal/journal-entry'
import type { OracleTable } from '../roll-table/oracle-table'

const ONE_MINUTE_IN_MS = 60 * 1000

type PackContents = Array<
	StoredDocument<
		| Scene
		| IronswornActor
		| Cards
		| IronswornItem
		| IronswornJournalEntry
		| Macro
		| Playlist
		| OracleTable
		| BaseAdventure
	>
>
const PACK_CACHE: Record<string, PackContents | undefined> = {}

async function populateCacheForPack(packName: string) {
	console.log(`Loading documents for pack ${packName}`)
	const pack = game.packs.get(packName)
	PACK_CACHE[packName] = (await pack?.getDocuments()) as
		| PackContents
		| undefined
}

export async function cachedDocumentsForPack(packName: string) {
	if (PACK_CACHE[packName] == null) {
		await populateCacheForPack(packName)
	}
	return PACK_CACHE[packName]
}

export async function primeCommonPackCaches() {
	const commonPackNames = [
		'foundry-ironsworn.starforgedoracles',
		'foundry-ironsworn.starforgedmoves',
		'foundry-ironsworn.ironswornoracles'
	]
	await Promise.all(commonPackNames.map(cachedDocumentsForPack))

	// Keep the cache from being garbage collected by refreshing it every so often
	let i = 0
	while (true) {
		await new Promise((r) => setTimeout(r, ONE_MINUTE_IN_MS))
		await populateCacheForPack(commonPackNames[i % commonPackNames.length])
		i++
	}
}
