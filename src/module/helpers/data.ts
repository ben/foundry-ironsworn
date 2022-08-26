import { cloneDeep } from 'lodash'
import type { RollOutcome } from '../rolls/ironsworn-roll.js'

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
  ExtraDescription?: string
  ExtraStrong?: string
  ExtraWeak?: string
  ExtraMiss?: string
  oracles?: MoveOracle[]
}

/**
 * Enumerates the outcome properties of {@link EnhancedDataswornMove} using the same values as {@link RollOutcome}
 */
export enum DsRollOutcome {
  Miss = 0,
  Weak = 1,
  Strong = 2,
}
/**
 * Enumerates the extra outcome properties of {@link EnhancedDataswornMove} using the same values as {@link RollOutcome}
 */
export enum DsRollOutcomeExtra {
  ExtraMiss = 0,
  ExtraWeak = 1,
  ExtraStrong = 2,
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
    CACHED_MOVES = await fetch(
      'systems/foundry-ironsworn/assets/moves.json'
    ).then((x) => x.json())
  }
  return CACHED_MOVES
}

export async function moveDataByName(
  name: string
): Promise<EnhancedDataswornMove | undefined> {
  const data = await cachedMoves()
  for (const category of data.Categories) {
    for (const move of category.Moves) {
      if (move.Name === name) {
        const theMove = cloneDeep(move)

        // Translate that text
        if (theMove.Description)
          theMove.Description = game.i18n.localize(
            `IRONSWORN.MoveContents.${theMove.Name}.description`
          )
        if (theMove.Strong)
          theMove.Strong = game.i18n.localize(
            `IRONSWORN.MoveContents.${theMove.Name}.strong`
          )
        if (theMove.Weak)
          theMove.Weak = game.i18n.localize(
            `IRONSWORN.MoveContents.${theMove.Name}.weak`
          )
        if (theMove.Miss)
          theMove.Miss = game.i18n.localize(
            `IRONSWORN.MoveContents.${theMove.Name}.miss`
          )

        return theMove
      }
    }
  }
  return undefined
}
