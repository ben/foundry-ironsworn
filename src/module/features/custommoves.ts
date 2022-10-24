import { IMove, IMoveCategory } from 'dataforged'
import { ISMoveCategories, SFMoveCategories } from '../dataforged/data'
import { IronswornItem } from '../item/item'
import { MoveDataSource } from '../item/itemtypes'
import { cachedDocumentsForPack } from './pack-cache'

export interface MoveCategory {
  color: string | null
  displayName: string
  moves: Move[]
  dataforgedCategory?: IMoveCategory
}

export interface Move {
  displayName: string
  moveItem: () => IronswornItem
  dataforgedMove?: IMove
}

// For some reason, rollupJs mangles this

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

// TODO dataforged has a key for move colours...., but they appear to have changed significantly since the last time i updated them! they'll be fixed for 2.0, but until then, here's a workaround.
enum MoveCategoryColor {
  Session = '#3F8C8A',
  Adventure = '#206087',
  Quest = '#805A90',
  Connection = '#4A5791',
  Exploration = '#427FAA',
  Combat = '#818992',
  Suffer = '#883529',
  Recover = '#488B44',
  Threshold = '#1D1D1B',
  Legacy = '#4F5A69',
  Fate = '#8F477B',
  'Scene Challenge' = '#206087',
}

function walkCategory(
  category: IMoveCategory,
  compendiumMoves: IronswornItem[]
): MoveCategory {
  const newCategory: MoveCategory = {
    color: MoveCategoryColor[category.Name] ?? null,
    // color: category.Display.Color ?? null,
    displayName: game.i18n.localize(`IRONSWORN.${category.Name}`),
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
        displayName: moveItem.name || move.Display.Title,
        moveItem: () => moveItem,
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

  console.log('folder', folder)

  // @ts-ignore Exists only in FVTT v10 API
  const color = (folder.color ?? null) as string | null

  const customMoves = [] as Move[]
  for (const moveItem of folder.contents) {
    if (moveItem.documentName !== 'Item' || moveItem.type !== 'sfmove') continue
    customMoves.push({
      displayName: moveItem.name ?? '(move)',
      moveItem: () => moveItem,
    })
  }

  if (customMoves.length > 0) {
    categories.push({
      color,
      displayName: name,
      moves: customMoves,
    })
  }
}
