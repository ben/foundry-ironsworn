import { ItemDataConstructorData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/itemData'
import { IronswornActor } from './actor/actor'

function getLegacyRank(numericRank) {
  switch (numericRank) {
    case 1: return 'troublesome'
    case 2: return 'dangerous'
    case 3: return 'formidable'
    case 4: return 'extreme'
    case 5: return 'epic'
  }
  return 'epic'
}

const PACKS = [
  'foundry-ironsworn.starforgedassets',
  'foundry-ironsworn.starforgedencounters',
  'foundry-ironsworn.starforgedmoves',
  'foundry-ironsworn.starforgedoracles',
  'foundry-ironsworn.foeactorssf'
]
/**
 * Converts JSON from dataforged resources into foundry packs. Requires packs to
 * already exist, but will empty them prior to repopulating. In a perfect world
 * we would retain dataforged's $id as Foundry's _id, but Foundry validates that
 * those fields meet with its UID expectations (/[a-zA-Z0-9]{16}/)
 */
export async function importFromDataforged() {
  // Empty out the packs
  for (const key of PACKS) {
    const pack = game.packs.get(key)
    if (!pack) continue
    // @ts-ignore IdQuery type is a little bogus
    const idsToDelete = pack.index.map(x => x._id)
    await Item.deleteDocuments(idsToDelete, { pack: key })
  }

  const idMap = await fetch('systems/foundry-ironsworn/assets/sf-ids.json').then((x) => x.json())

  // Moves
  const movesJson = await fetch('systems/foundry-ironsworn/assets/sf-moves.json').then((x) => x.json())
  const movesToCreate = [] as (ItemDataConstructorData & Record<string, unknown>)[]
  for (const move of movesJson) {
    movesToCreate.push({
      _id: idMap[move['$id']],
      type: 'move',
      name: move['Name'],
      img: 'icons/dice/d10black.svg',
      data: {
        fulltext: move['Text'],
        description: move['Description'],
        strong: move['Outcomes']?.['Strong Hit']?.['Text'],
        strongmatch: move['Outcomes']?.['Strong Hit']?.['With a Match']?.['Text'],
        weak: move['Outcomes']?.['Weak Hit']?.['Text'],
        miss: move['Outcomes']?.['Miss']?.['Text'],
        missmatch: move['Outcomes']?.['Miss']?.['With a Match']?.['Text'],
        stats: move['Trigger']?.['Options']?.map(o => o['Action roll']?.Stat?.toLowerCase()).filter(s => s) || [],
        sourceId: move['$id']
      },
    })
  }
  await Item.createDocuments(movesToCreate, { pack: 'foundry-ironsworn.starforgedmoves', keepId: true })

  // Assets
  const assetsJson = await fetch('systems/foundry-ironsworn/assets/sf-assets.json').then((x) => x.json())
  const assetsToCreate = assetsJson.map((asset) => ({
    _id: idMap[asset['$id']],
    type: 'asset',
    name: `${asset['Asset Type']} / ${asset['Name']}`,
    data: {
      description: asset['Text'],
      fields: asset['Input']?.map((name) => ({
        name,
        value: '',
      })) || [],
      abilities: asset['Abilities'].map((ability) => ({
        enabled: ability['Enabled'] || false,
        description: ability['Text'],
      })),
      track: {
        enabled: !!asset['Condition Meter'],
        name: asset['Condition Meter']?.Name,
        current: asset['Condition Meter']?.['Starting Value'],
        max: asset['Condition Meter']?.Max,
      },
      exclusiveOptions: [], // TODO:
    },
  }))
  await Item.createDocuments(assetsToCreate, { pack: 'foundry-ironsworn.starforgedassets', keepId: true })

  // Encounters
  const encountersJson = await fetch('systems/foundry-ironsworn/assets/sf-encounters.json').then((x) => x.json())
  const encountersToCreate = [] as (ItemDataConstructorData & Record<string, unknown>)[]
  for (const encounter of encountersJson) {
    const description = await renderTemplate('systems/foundry-ironsworn/templates/item/foe.hbs', {
      ...encounter,
      Category: encounter['Nature'],
      CategoryDescription: encounter['Summary'],
      Quest: encounter['Quest Starter'],
    })

    encountersToCreate.push({
      _id: idMap[encounter['$id']],
      type: 'progress',
      name: encounter['Name'],
      data: {
        description,
        rank: getLegacyRank(encounter['Rank']),
      },
    })

    for (const variant of encounter['Variants']) {
      const variantDescription = await renderTemplate('systems/foundry-ironsworn/templates/item/foe.hbs', {
        ...encounter,
        ...variant,
        Category: variant['Nature'] || encounter['Nature'],
        CategoryDescription: variant['Summary'] || encounter['Summary'],
      })

      encountersToCreate.push({
        _id: idMap[variant['$id']],
        type: 'progress',
        name: variant['Name'],
        data: {
          description: variantDescription,
          rank: getLegacyRank('Rank' in variant ? variant['Rank'] : encounter['Rank']),
        },
      })
    }
  }
  await Item.createDocuments(encountersToCreate, { pack: 'foundry-ironsworn.starforgedencounters', keepId: true })

  // Foes
  const foesPack = game.packs.get('foundry-ironsworn.starforgedencounters')
  const foeItems = await foesPack?.getDocuments()
  for (const foeItem of foeItems ?? []) {
    const actor = await IronswornActor.create(
      {
        name: foeItem.name ?? 'wups',
        img: foeItem.data.img,
        type: 'foe',
      },
      { pack: 'foundry-ironsworn.foeactorssf' }
    )
    await actor?.createEmbeddedDocuments('Item', [foeItem.data])
  }

  // Oracles
  const oraclesJson = await fetch('systems/foundry-ironsworn/assets/sf-oracles.json').then((x) => x.json())
  const oraclesToCreate = [] as (Record<string, unknown>)[]
  // Oracles JSON is a tree we wish to iterate through depth first adding
  // parents prior to their children, and children in order
  const nodeStack = Array.from(oraclesJson).reverse() as any[]
  while (nodeStack.length) {
    const node = nodeStack.pop() as (Record<string, any>)
    if (node['Table']) {
      oraclesToCreate.push({
        _id: idMap[node['$id']],
        name: (node['$id'] as string).substring(10),
        img: 'icons/dice/d10black.svg',
        description: node['Description'],
        formula: '1d100',
        replacement: true,
        displayRoll: true,
        /* folder: // would require using an additional module */
        results: node['Table'].map((tableRow) => ({
          range: [tableRow['Floor'], tableRow['Ceiling']],
          text: tableRow['Result'],
        } as Record<string, unknown>))
      })
    }
    // add children to stack
    if (node['Oracles']) {
      nodeStack.push(...Array.from(node['Oracles']).reverse())
    }
    if (node['Categories']) {
      nodeStack.push(...Array.from(node['Categories']).reverse())
    }
  }
  await RollTable.createDocuments(oraclesToCreate, { pack: 'foundry-ironsworn.starforgedoracles', keepId: true })
}
