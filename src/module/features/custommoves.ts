import {
  starforged,
  ironsworn,
  IMove,
  IMoveCategory,
  Ironsworn,
  Starforged,
} from 'dataforged'
import { IronswornItem } from '../item/item'
import { MoveDataSource } from '../item/itemtypes'
import { cachedDocumentsForPack } from './pack-cache'

export interface MoveCategory {
  displayName: string
  moves: Move[]
  dataforgedCategory?: IMoveCategory
}

export interface Move {
  displayName: string
  moveItem: () => IronswornItem
  dataforgedMove?: IMove
  highlighted: boolean
}

// For some reason, rollupJs mangles this
const SFMoveCategories = ((starforged as any).default as Starforged)[
  'Move Categories'
]
const ISMoveCategories = ((ironsworn as any).default as Ironsworn)[
  'Move Categories'
]

async function createMoveTree(
  compendiumName: string,
  categories: IMoveCategory[]
): Promise<MoveCategory[]> {
  const ret = [] as MoveCategory[]

  // Make sure compendium is loaded
  const compendiumMoves = await cachedDocumentsForPack(compendiumName)

  // Construct the base tree
  for (const category of categories) {
    ret.push(walkCategory(category, compendiumMoves as IronswornItem[]))
  }

  // Add custom moves from well-known folder
  await augmentWithFolderContents(ret)

  // Fire the hook and allow extensions to modify the list
  await Hooks.call('ironswornMoves', ret)

  return ret
}

export async function createIronswornMoveTree(): Promise<MoveCategory[]> {
  return createMoveTree('foundry-ironsworn.ironswornmoves', ISMoveCategories)
}

export async function createStarforgedMoveTree(): Promise<MoveCategory[]> {
  return createMoveTree('foundry-ironsworn.starforgedmoves', SFMoveCategories)
}

function walkCategory(
  category: IMoveCategory,
  compendiumMoves: IronswornItem[]
): MoveCategory {
  const newCategory = {
    displayName: game.i18n.localize(`IRONSWORN.${category.Title.Short}`),
    dataforgedCategory: category,
    moves: [] as Move[],
  }

  for (const move of category.Moves) {
    const moveItem = compendiumMoves?.find(
      (x) => (x.data as MoveDataSource).data.dfid === move.$id
    )
    if (moveItem) {
      newCategory.moves.push({
        dataforgedMove: move,
        displayName: moveItem.name || move.Title.Short,
        moveItem: () => moveItem,
        highlighted: false,
      })
    } else {
      console.warn(`Couldn't find item for move ${move.$id}`)
    }
  }

  return newCategory
}

async function augmentWithFolderContents(categories: MoveCategory[]) {
  const name = game.i18n.localize('IRONSWORN.Custom Moves')
  const folder = (game.items?.directory as any)?.folders.find(
    (x) => x.name === name
  ) as Folder | undefined
  if (!folder || folder.contents.length == 0) return

  categories.push({
    displayName: name,
    moves: folder.contents.map((moveItem) => ({
      displayName: moveItem.name,
      moveItem: () => moveItem,
    })) as Move[],
  })
}
