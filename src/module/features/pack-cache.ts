import { BaseAdventure } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/documents.mjs/baseAdventure.js'
import { IronswornActor } from '../actor/actor'
import { IronswornItem } from '../item/item'

const ONE_MINUTE_IN_MS = 60 * 1000

type PackContents = StoredDocument<
  | Scene
  | IronswornActor
  | Cards
  | IronswornItem
  | JournalEntry
  | Macro
  | Playlist
  | RollTable
  | BaseAdventure
>[]
const PACK_CACHE: { [key: string]: PackContents | undefined } = {}

async function populateCacheForPack(packName: string) {
  console.log(`Loading documents for pack ${packName}`)
  const pack = game.packs.get(packName)
  PACK_CACHE[packName] = await pack?.getDocuments()
}

export async function cachedDocumentsForPack(packName: string) {
  if (!PACK_CACHE[packName]) {
    await populateCacheForPack(packName)
  }
  return PACK_CACHE[packName]
}

export async function primeCommonPackCaches() {
  const commonPackNames = [
    'foundry-ironsworn.starforgedoracles',
    'foundry-ironsworn.starforgedmoves',
    'foundry-ironsworn.ironsworntables',
    'foundry-ironsworn.ironswornoracles',
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
