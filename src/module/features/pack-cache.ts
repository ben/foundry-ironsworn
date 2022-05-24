import { IronswornItem } from "../item/item"

type PackContents = (IronswornItem | JournalEntry | Macro | Playlist | Scene)[]
const PACK_CACHE: { [key: string]: PackContents | undefined } = {}

export async function cachedDocumentsForPack(packName: string): Promise<PackContents | undefined> {
  if (!PACK_CACHE[packName]) {
    console.log(`Loading documents for pack ${packName}`)
    const pack = game.packs.get(packName)
    PACK_CACHE[packName] = await pack?.getDocuments()
  }
  return PACK_CACHE[packName]
}
