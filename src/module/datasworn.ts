import { ItemDataConstructorData } from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/itemData"

export async function importFromDatasworn() {
  // Empty out the packs
  for (const key of ['world.ironsworn-items', 'world.ironsworn-assets']) {
    const pack = game.packs.get(key)
    if (!pack) continue
    await pack.render(true)
    const idsToDelete = pack.index.map((x: any) => x._id)
    for (const id of idsToDelete) {
      await pack.deleteEntity(id)
    }
  }

  // Moves
  const movesPack = game?.packs?.get('world.ironsworn-items')
  if (movesPack) {
    const movesJson = await fetch('/systems/foundry-ironsworn/assets/moves.json').then((x) => x.json())
    const movesToCreate = [] as (ItemDataConstructorData & Record<string, unknown>)[]
    for (const category of movesJson.Categories) {
      for (const move of category.Moves) {
        movesToCreate.push({
          type: 'move',
          name: move.Name,
          img: 'icons/dice/d10black.svg',
          data: {
            description: move.Description,
            strong: move.Strong,
            weak: move.Weak,
            miss: move.Miss,
            stats: move.Stats || [],
          },
        })
      }
    }
    await Item.createDocuments(movesToCreate, { pack: 'world.ironsworn-items' })
  }

  // Assets
  const assetsJson = await fetch('/systems/foundry-ironsworn/assets/assets.json').then((x) => x.json())
  const assetsToCreate = assetsJson.map((raw) => ({
    type: 'asset',
    ...raw,
  }))
  await Item.createDocuments(assetsToCreate, { pack: 'world.ironsworn-assets' })
}
