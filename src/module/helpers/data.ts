let CACHED_MOVES
export async function cachedMoves(): Promise<any> {
  if (!CACHED_MOVES) {
    CACHED_MOVES = await fetch('/systems/foundry-ironsworn/assets/moves.json')
      .then(x => x.json())
  }
  return CACHED_MOVES
}
