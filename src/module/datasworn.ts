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

const DOMAIN_IMAGES = {
  Barrow: 'icons/environment/wilderness/cave-entrance-dwarven-hill.webp',
  Cavern: 'icons/environment/wilderness/cave-entrance-mountain-blue.webp',
  'Frozen Cavern': 'icons/magic/water/water-iceberg-bubbles.webp',
  Icereach: 'icons/magic/water/barrier-ice-crystal-wall-jagged-blue.webp',
  Mine: 'icons/environment/settlement/mine-cart-rocks-red.webp',
  Pass: 'icons/environment/wilderness/cave-entrance-rocky.webp',
  Ruin: 'icons/environment/wilderness/wall-ruins.webp',
  'Sea Cave': 'icons/environment/wilderness/cave-entrance-island.webp',
  Shadowfen: 'icons/environment/wilderness/cave-entrance.webp',
  Stronghold: 'icons/environment/settlement/castle.webp',
  Tanglewood: 'icons/environment/wilderness/terrain-forest-gray.webp',
  Underkeep: 'icons/environment/wilderness/mine-interior-dungeon-door.webp',
}

const FOE_IMAGES = {}

export async function importFromDatasworn() {
  // Empty out the packs
  for (const key of ['world.ironsworn-items', 'world.ironsworn-assets', 'world.ironsworn-delve-themes', 'world.ironsworn-delve-domains', 'world.ironsworn-foes']) {
    const pack = game.packs.get(key)
    if (!pack) continue
    await pack.render(true)
    const idsToDelete = pack.index.map((x: any) => x._id)
    for (const id of idsToDelete) {
      await pack.deleteEntity(id)
    }
  }

  // Moves
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

    return themeData
  })
  await Item.createDocuments(themesToCreate, { pack: 'world.ironsworn-delve-themes' })

  // Domains
  const domainsJson = await fetch('/systems/foundry-ironsworn/assets/delve-domains.json').then((x) => x.json())
  const domainsToCreate = domainsJson.Domains.map((rawDomain) => {
    const domainData = {
      type: 'delve-domain',
      name: rawDomain.Name,
      img: DOMAIN_IMAGES[rawDomain.Name],
      data: {
        summary: rawDomain.Summary,
        description: rawDomain.Description,
        features: [] as any[],
        dangers: [] as any[],
      },
    }

    let low = 21
    for (const feature of rawDomain.Features) {
      domainData.data.features.push({
        low,
        high: feature.Chance,
        description: feature.Description,
      })
      low = feature.Chance + 1
    }
    low = 31
    for (const danger of rawDomain.Dangers) {
      domainData.data.dangers.push({
        low,
        high: danger.Chance,
        description: danger.Description,
      })
      low = danger.Chance + 1
    }

    return domainData
  })
  await Item.createDocuments(domainsToCreate, { pack: 'world.ironsworn-delve-domains' })

  // Foes
  const foesJson = await fetch('/systems/foundry-ironsworn/assets/foes.json').then((x) => x.json())
  const foesToCreate = [] as (ItemDataConstructorData & Record<string, unknown>)[]
  for (const category of foesJson.Categories) {
    for (const foe of category.Foes) {
      const description = await renderTemplate('systems/foundry-ironsworn/templates/item/foe.hbs', {
        ...foe,
        Category: category.Name,
        CategoryDescription: category.Description,
      })

      foesToCreate.push({
        type: 'progress',
        name: foe.Name,
        img: FOE_IMAGES[foe.Name] || undefined,
        data: {
          description,
          rank: foe.Rank.toLowerCase(),
        },
      })
    }
  }
  await Item.createDocuments(foesToCreate, { pack: 'world.ironsworn-foes' })
}
