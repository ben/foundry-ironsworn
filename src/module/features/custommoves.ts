import { IMove, IMoveCategory, starforged } from 'dataforged'
import { IronswornItem } from '../item/item'
import { MoveDataSource } from '../item/itemtypes'

export interface MoveCategory {
  displayName: string
  moves: Move[]
  dataforgedCategory?: IMoveCategory
}

export interface Move {
  displayName: string
  moveItem: IronswornItem
  dataforgedMove?: IMove
}

export async function createStarforgedMoveTree(): Promise<MoveCategory[]> {
  const ret = [] as MoveCategory[]

  // Make sure compendium is loaded
  const pack = game.packs.get('foundry-ironsworn.starforgedmoves')
  const compendiumMoves = (await pack?.getDocuments()) as IronswornItem[]

  // Construct the base tree
  for (const category of starforged.moves) {
    ret.push(walkCategory(category, compendiumMoves))
  }

  // TODO: Add custom moves from well-known folder

  // Fire the hook and allow extensions to modify the list
  await Hooks.call('ironswornMoves', ret)

  return ret
}

function walkCategory(category: IMoveCategory, compendiumMoves: IronswornItem[]): MoveCategory {
  const newCategory = {
    displayName: game.i18n.localize(`IRONSWORN.${category.Name}`),
    dataforgedCategory: category,
    moves: [] as Move[],
  }

  for (const move of category.Moves) {
    const moveItem = compendiumMoves?.find((x) => (x.data as MoveDataSource).data.dfid === move.$id)
    if (moveItem) {
      newCategory.moves.push({
        dataforgedMove: move,
        displayName: moveItem.name || move.Display.Title,
        moveItem,
      })
    } else {
      console.warn(`Couldn't find item for move ${move.$id}`)
    }
  }

  return newCategory
}
