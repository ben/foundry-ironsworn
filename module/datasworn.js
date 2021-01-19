export async function importFromDatasworn () {
  // Empty out the pack
  const pack = game.packs.get('world.ironsworn-items')
  const idsToDelete = pack.index.map(x => x._id)
  for (const id of idsToDelete) {
    await pack.deleteEntity(id)
  }

  // Moves
  const movesJson = await fetch(
    '/systems/foundry-ironsworn/assets/moves.json'
  ).then(x => x.json())
  for (const move of movesJson) {
    await pack.createEntity({
      type: 'move',
      ...move
    })
  }

  // Assets
  const assetsJson = await fetch(
    '/systems/foundry-ironsworn/assets/assets.json'
  ).then(x => x.json())
  for (const asset of assetsJson) {
    await pack.createEntity({
      type: 'asset',
      ...asset
    })
  }
}
