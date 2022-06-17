import { BaseAdventure } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/documents.mjs/baseAdventure.js'
import { IronswornActor } from '../actor/actor'
import { IronswornItem } from '../item/item'

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

export async function cachedDocumentsForPack(packName: string) {
  if (!PACK_CACHE[packName]) {
    console.log(`Loading documents for pack ${packName}`)
    const pack = game.packs.get(packName)
    PACK_CACHE[packName] = await pack?.getDocuments()
  }
  return PACK_CACHE[packName]
}

export async function primeCommonPackCaches() {
  const commonPackNames = [
    'foundry-ironsworn.starforgedoracles',
    'foundry-ironsworn.starforgedmoves',
    'foundry-ironsworn.ironsworntables',
    'foundry-ironsworn.ironswornoracles',
    'foundry-ironsworn.ironswornitems',
  ]
  await Promise.all(commonPackNames.map(cachedDocumentsForPack))
}
