interface EnhancedDataswornMove {
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
    CACHED_MOVES = await fetch('/systems/foundry-ironsworn/assets/moves.json')
      .then(x => x.json())
  }
  return CACHED_MOVES
}

export async function moveDataByName(name: string): Promise<EnhancedDataswornMove | undefined> {
  const data = await cachedMoves()
  for (const category of data.Categories) {
    for (const move of category.Moves) {
      if (move.Name === name) return move
    }
  }
  return undefined
}
