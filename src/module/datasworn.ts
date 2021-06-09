export async function importFromDatasworn() {
  // Empty out the packs
  for (const key of ['world.ironsworn-items', 'world.ironsworn-assets']) {
    const pack = game?.packs?.get(key)
    if (!pack) return
    await pack.render(true)
    const idsToDelete = pack.index.map((x) => x._id)
    for (const id of idsToDelete) {
      await pack.deleteEntity(id)
    }
  }

  // Moves
  const movesPack = game?.packs?.get('world.ironsworn-items')
  const movesJson = await fetch('/systems/foundry-ironsworn/assets/moves.json').then((x) => x.json())
  for (const move of movesJson) {
    await movesPack?.createEntity({
      type: 'move',
      ...move,
    })
  }

  // Assets
  const assetsPack = game?.packs?.get('world.ironsworn-assets')
  const assetsJson = await fetch('/systems/foundry-ironsworn/assets/assets.json').then((x) => x.json())
  for (const asset of assetsJson) {
    await assetsPack?.createEntity({
      type: 'asset',
      ...asset,
    })
  }
}
