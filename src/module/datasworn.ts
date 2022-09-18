import { ItemDataConstructorData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/itemData'
import { RollTableDataConstructorData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/rollTableData.js'
import { TableResultDataConstructorData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/tableResultData.js'
import {
  IMoveCategory,
  IOracle,
  IOracleCategory,
  Ironsworn,
  ironsworn,
  IRow,
} from 'dataforged'
import { max } from 'lodash'
import { marked } from 'marked'
import { IronswornActor } from './actor/actor'
import {
  cleanDollars,
  hash,
  renderLinksInMove,
  renderLinksInStr,
} from './dataforged'
import { IronswornItem } from './item/item.js'

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

const FOE_IMAGES = {
  Broken: 'icons/creatures/mammals/humanoid-fox-cat-archer.webp',
  'Common Folk': 'icons/tools/hand/shovel-spade-steel-blue-brown.webp',
  Hunter: 'icons/environment/people/archer.webp',
  Mystic: 'icons/environment/people/cleric-orange.webp',
  Raider: 'icons/sundries/flags/banner-flag-pirate.webp',
  Warrior: 'icons/skills/melee/hand-grip-sword-red.webp',
  Husk: 'icons/magic/earth/strike-body-stone-crumble.webp',
  Zealot: 'icons/environment/people/cleric-grey.webp',
  Elf: 'icons/creatures/magical/humanoid-horned-rider.webp',
  Giant: 'icons/creatures/magical/humanoid-giant-forest-blue.webp',
  Primordial: 'icons/creatures/magical/spirit-undead-horned-blue.webp',
  Troll: 'icons/creatures/mammals/bull-horns-eyes-glowin-orange.webp',
  Varou: 'icons/creatures/mammals/wolf-shadow-black.webp',
  Atanya: 'icons/magic/air/wind-weather-sailing-ship.webp',
  Merrow: 'icons/creatures/fish/fish-man-eye-green.webp',
  Bear: 'icons/creatures/abilities/bear-roar-bite-brown-green.webp',
  Boar: 'icons/commodities/treasure/figurine-boar.webp',
  Gaunt: 'icons/magic/fire/elemental-creature-horse.webp',
  'Marsh Rat': 'icons/creatures/mammals/rodent-rat-diseaed-gray.webp',
  Wolf: 'icons/creatures/abilities/wolf-howl-moon-purple.webp',
  Bladewing: 'icons/creatures/magical/spirit-undead-winged-ghost.webp',
  'Carrion Newt':
    'icons/creatures/reptiles/chameleon-camouflage-green-brown.webp',
  'Cave Lion': 'icons/creatures/abilities/lion-roar-yellow.webp',
  'Deep Rat': 'icons/creatures/mammals/rodent-rat-green.webp',
  'Nightmare Spider':
    'icons/creatures/invertebrates/spider-mandibles-brown.webp',
  'Shroud Crab': 'icons/consumables/meat/claw-crab-lobster-serrated-pink.webp',
  Trog: 'icons/creatures/reptiles/lizard-iguana-green.webp',
  Basilisk: 'icons/creatures/reptiles/snake-poised-white.webp',
  'Elder Beast':
    'icons/creatures/mammals/beast-horned-scaled-glowing-orange.webp',
  'Harrow Spider': 'icons/creatures/invertebrates/spider-web-black.webp',
  Leviathan: 'icons/creatures/reptiles/serpent-horned-green.webp',
  Mammoth: 'icons/commodities/leather/fur-white.webp',
  Wyvern: 'icons/creatures/abilities/wolf-heads-swirl-purple.webp',
  Chitter: 'icons/creatures/invertebrates/bug-sixlegged-gray.webp',
  Gnarl: 'icons/magic/nature/tree-animated-strike.webp',
  'Iron-Wracked Beast': 'icons/environment/wilderness/statue-hound-horned.webp',
  Kraken: 'icons/creatures/fish/squid-kraken-orange.webp',
  Nightspawn: 'icons/creatures/unholy/demon-horned-black-yellow.webp',
  Rhaskar: 'icons/creatures/fish/fish-marlin-swordfight-blue.webp',
  Wyrm: 'icons/creatures/eyes/lizard-single-slit-pink.webp',
  Bonewalker: 'icons/magic/death/undead-skeleton-worn-blue.webp',
  Frostbound: 'icons/creatures/magical/spirit-undead-ghost-blue.webp',
  Chimera: 'icons/creatures/magical/spirit-earth-stone-magma-yellow.webp',
  Haunt: 'icons/magic/death/undead-ghost-strike-white.webp',
  Hollow: 'icons/consumables/plants/grass-leaves-green.webp',
  'Iron Revenant': 'icons/creatures/magical/construct-golem-stone-blue.webp',
  Sodden: 'icons/magic/death/undead-ghost-scream-teal.webp',
  Blighthound: 'icons/commodities/treasure/figurine-dog.webp',
  'Bog Rot': 'icons/magic/death/hand-dirt-undead-zombie.webp',
  Bonehorde: 'icons/skills/trades/academics-study-archaeology-bones.webp',
  Thrall: 'icons/creatures/abilities/mouth-teeth-human.webp',
  Wight: 'icons/creatures/magical/humanoid-silhouette-green.webp',
  'Blood Thorn': 'icons/consumables/plants/thorned-stem-vine-green.webp',
  'Circle of Stones': 'icons/environment/wilderness/arch-stone.webp',
  Glimmer: 'icons/magic/nature/elemental-plant-humanoid.webp',
  Gloom: 'icons/magic/perception/silhouette-stealth-shadow.webp',
  Maelstrom: 'icons/magic/water/vortex-water-whirlpool.webp',
  Tempest: 'icons/magic/lightning/bolts-salvo-clouds-sky.webp',
}

const PACKS = [
  'foundry-ironsworn.ironswornmoves',
  'foundry-ironsworn.ironswornassets',
  'foundry-ironsworn.ironsworndelvethemes',
  'foundry-ironsworn.ironsworndelvedomains',
  'foundry-ironsworn.ironswornfoes',
  'foundry-ironsworn.foeactorsis',
  'foundry-ironsworn.ironswornoracles',
]

export async function importFromDatasworn() {
  // Empty out the packs
  for (const key of PACKS) {
    const pack = game.packs.get(key)
    if (!pack) continue
    const idsToDelete = pack.index.map((x: any) => x._id)
    await Item.deleteDocuments(idsToDelete, { pack: key })
  }

  // Moves
  await processDataforgedMoves()

  // Assets
  const assetsJson = await fetch(
    'systems/foundry-ironsworn/assets/assets.json'
  ).then((x) => x.json())
  const assetsToCreate = assetsJson.map((raw) => ({
    type: 'asset',
    ...raw,
  }))
  await Item.createDocuments(assetsToCreate, {
    pack: 'foundry-ironsworn.ironswornassets',
  })

  // Themes
  const themesJson = await fetch(
    'systems/foundry-ironsworn/assets/delve-themes.json'
  ).then((x) => x.json())
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
  await Item.createDocuments(themesToCreate, {
    pack: 'foundry-ironsworn.ironsworndelvethemes',
  })

  // Domains
  const domainsJson = await fetch(
    'systems/foundry-ironsworn/assets/delve-domains.json'
  ).then((x) => x.json())
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
  await Item.createDocuments(domainsToCreate, {
    pack: 'foundry-ironsworn.ironsworndelvedomains',
  })

  // Foes
  const foesJson = await fetch(
    'systems/foundry-ironsworn/assets/foes.json'
  ).then((x) => x.json())
  const foesToCreate = [] as (ItemDataConstructorData &
    Record<string, unknown>)[]
  for (const category of foesJson.Categories) {
    for (const foe of category.Foes) {
      const description = await renderTemplate(
        'systems/foundry-ironsworn/templates/item/foe.hbs',
        {
          ...foe,
          Category: category.Name,
          CategoryDescription: category.Description,
        }
      )

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
  await Item.createDocuments(foesToCreate, {
    pack: 'foundry-ironsworn.ironswornfoes',
  })

  // Foe actors
  const foesPack = game.packs.get('foundry-ironsworn.ironswornfoes')
  const foeItems =
    (await foesPack?.getDocuments()) as StoredDocument<IronswornItem>[]
  for (const foeItem of foeItems ?? []) {
    const actor = await IronswornActor.create(
      {
        name: foeItem.name ?? 'wups',
        img: foeItem.data.img,
        type: 'foe',
      },
      { pack: 'foundry-ironsworn.foeactorsis' }
    )
    await actor?.createEmbeddedDocuments('Item', [
      foeItem.data as unknown as Record<string, unknown>,
    ])
  }
}

async function processDataforgedMoves() {
  const movesToCreate = [] as (ItemDataConstructorData &
    Record<string, unknown>)[]
  const MoveCategories = ((ironsworn as any).default as Ironsworn)[
    'Move Categories'
  ]
  for (const category of MoveCategories) {
    for (const move of category.Moves) {
      renderLinksInMove(move)
      const cleanMove = cleanDollars(move)
      movesToCreate.push({
        _id: hash(move.$id),
        type: 'sfmove',
        name: move['Name'],
        img: 'icons/dice/d10black.svg',
        data: cleanMove,
      })
    }
  }
  await Item.createDocuments(movesToCreate, {
    pack: 'foundry-ironsworn.ironswornmoves',
    keepId: true,
  })
}
