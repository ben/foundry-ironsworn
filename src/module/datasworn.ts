import { ItemDataConstructorData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/itemData'

const THEME_IMAGES = {
  Ancient: 'icons/environment/wilderness/carved-standing-stone.webp',
  Corrupted: 'icons/magic/unholy/beam-impact-purple.webp',
  Fortified: 'icons/environment/settlement/watchtower-cliff.webp',
  Hallowed: 'icons/magic/holy/angel-wings-gray.webp',
  Haunted: 'icons/creatures/magical/spirit-undead-horned-blue.webp',
  Infested: 'icons/creatures/eyes/icy-cluster-blue.webp',
  Ravaged: 'icons/environment/settlement/building-rubble.webp',
  Wild: 'icons/magic/nature/root-vines-grow-brown.webp',
}

export async function importFromDatasworn() {
  // Empty out the packs
  for (const key of ['world.ironsworn-items', 'world.ironsworn-assets', 'world.ironsworn-delve-themes', 'world.ironsworn-delve-domains']) {
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

  // Themes
  const themesJson = await fetch('/systems/foundry-ironsworn/assets/delve-themes.json').then((x) => x.json())
  const themesToCreate = themesJson.Themes.map((rawTheme) => {
    const themeData = {
      type: 'delve-theme',
      name: rawTheme.Name,
      img: THEME_IMAGES[rawTheme.Name],
      data: {
        summary: rawTheme.Summary,
        description: rawTheme.Description,
        features: [] as any[],
        dangers: [] as any[],
      },
    }

    let low = 1
    for (const feature of rawTheme.Features) {
      themeData.data.features.push({
        low,
        high: feature.Chance,
        description: feature.Description,
      })
      low = feature.Chance + 1
    }
    low = 1
    for (const danger of rawTheme.Dangers) {
      themeData.data.dangers.push({
        low,
        high: danger.Chance,
        description: danger.Description,
      })
      low = danger.Chance + 1
    }

    console.log(themeData)

    return themeData
  })
  await Item.createDocuments(themesToCreate, { pack: 'world.ironsworn-delve-themes' })
}
