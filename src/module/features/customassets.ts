import { IAsset, IAssetType } from 'dataforged'
import { capitalize } from 'vue'
import { renderLinksInStr, hashLookup } from '../dataforged'
import { ISAssetTypes, SFAssetTypes } from '../dataforged/data'
import { IronswornItem } from '../item/item'

export interface DisplayAsset {
  df?: IAsset
  foundryItem: Readonly<IronswornItem>
}

export interface DisplayCategory {
  df?: IAssetType
  title: string
  description?: string
  expanded: boolean
  assets: DisplayAsset[]
}

export async function createIronswornAssetTree(): Promise<DisplayCategory[]> {
  return createAssetTree(
    'foundry-ironsworn.ironswornassets',
    'Ironsworn',
    ISAssetTypes
  )
}
export async function createStarforgedAssetTree(): Promise<DisplayCategory[]> {
  return createAssetTree(
    'foundry-ironsworn.starforgedassets',
    'Starforged',
    SFAssetTypes
  )
}

async function createAssetTree(
  compendiumName: string,
  i18nkeyslug: string,
  assetTypes: IAssetType[]
): Promise<DisplayCategory[]> {
  // Load from compendium
  const ret = await compendiumMoves(compendiumName, i18nkeyslug, assetTypes)

  // Add custom omves from well-known folder
  await augmentWithFolderContents(ret)

  // fire the hook and allow extensions to modify the list
  await Hooks.call('ironswornAssets', ret)

  return ret
}

async function compendiumMoves(
  compendiumName: string,
  i18nkeyslug: string,
  assetTypes: IAssetType[]
): Promise<DisplayCategory[]> {
  const pack = game.packs.get(compendiumName)
  if (!pack) throw new Error(`can't load pack ${compendiumName}`)

  const i18n = (categoryName: string, extension: string) => {
    const capCat = capitalize(categoryName)
    return game.i18n.localize(
      `IRONSWORN.Asset Categories.${i18nkeyslug}.${capCat}.${extension}`
    )
  }

  const categories = [] as DisplayCategory[]
  for (const dfAssetType of assetTypes) {
    const i18nDescription = i18n(dfAssetType.Name, 'Description')
    const cat: DisplayCategory = {
      df: dfAssetType,
      title: i18n(dfAssetType.Name, 'Title'),
      description: renderLinksInStr(i18nDescription),
      expanded: false,
      assets: [],
    }

    for (const dfAsset of dfAssetType.Assets) {
      const item = (await pack.getDocument(
        hashLookup(dfAsset.$id)
      )) as IronswornItem
      cat.assets.push({
        df: dfAsset,
        foundryItem: Object.freeze(item),
      })
    }

    categories.push(cat)
  }

  return categories
}

async function augmentWithFolderContents(categories: DisplayCategory[]) {
  const name = game.i18n.localize('IRONSWORN.Custom Assets')
  const folder = (game.items?.directory as any)?.folders.find(
    (x) => x.name === name
  ) as Folder | undefined
  if (!folder || folder.contents.length == 0) return

  const customAssets = [] as DisplayAsset[]
  for (const item of folder.contents) {
    if (item.documentName !== 'Item' || item.type !== 'asset') continue
    customAssets.push({ foundryItem: Object.freeze(item) })
  }

  categories.push({
    title: name,
    expanded: false,
    assets: customAssets,
  })
}
