import { cloneDeep } from 'lodash'

export type MoveOracleEntry = {
  low: number
  high: number
  description: string
}

export type MoveOracle = {
  name: string
  stat?: string
  table: MoveOracleEntry[]
}

export interface EnhancedDataswornMove {
  Name: string
  Source: {
    Name: string
    Page: string
  }
  Stats: string[]
  Text: string
  Description: string
  Strong: string | undefined
  Weak: string | undefined
  Miss: string | undefined
  oracles?: MoveOracle[]
}

interface EnhancedDataswornMoveCategory {
  Name: string
  Moves: EnhancedDataswornMove[]
}

interface EnhancedDataswornMoveData {
  Title: string
  Source: {
    Name: string
  }
  Categories: EnhancedDataswornMoveCategory[]
}

let CACHED_MOVES
export async function cachedMoves(): Promise<EnhancedDataswornMoveData> {
  if (!CACHED_MOVES) {
    CACHED_MOVES = await fetch('/systems/foundry-ironsworn/assets/moves.json').then((x) => x.json())
  }
  return CACHED_MOVES
}

export async function moveDataByName(name: string): Promise<EnhancedDataswornMove | undefined> {
  const data = await cachedMoves()
  for (const category of data.Categories) {
    for (const move of category.Moves) {
      if (move.Name === name) {
        const theMove = cloneDeep(move)

        // Translate that text
        if (theMove.Description) theMove.Description = game.i18n.localize(`IRONSWORN.MoveContents.${theMove.Name}.description`)
        if (theMove.Strong) theMove.Strong = game.i18n.localize(`IRONSWORN.MoveContents.${theMove.Name}.strong`)
        if (theMove.Weak) theMove.Weak = game.i18n.localize(`IRONSWORN.MoveContents.${theMove.Name}.weak`)
        if (theMove.Miss) theMove.Miss = game.i18n.localize(`IRONSWORN.MoveContents.${theMove.Name}.miss`)

        return theMove
      }
    }
  }
  return undefined
}
