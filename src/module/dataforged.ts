import { ItemDataConstructorData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/itemData'
import { IronswornActor } from './actor/actor'

function getLegacyRank(numericRank) {
  switch (numericRank) {
    case 1:
      return 'troublesome'
    case 2:
      return 'dangerous'
    case 3:
      return 'formidable'
    case 4:
      return 'extreme'
    case 5:
      return 'epic'
  }
  return 'epic'
}

interface MoveTriggerRoll {
  'Best of'?: string[]
  'Worst of'?: string[]
  'All of'?: string[]
  Stat?: string
  Track?: string
}
interface MoveTriggerOption {
  Text: string
  'Action roll'?: MoveTriggerRoll
  'Progress roll'?: MoveTriggerRoll
}
interface MoveTrigger {
  Text: string
  Options?: MoveTriggerOption[]
}

function textForMoveTriggerOption(option: MoveTriggerOption): string {
  // Progress roll: "Roll +<track name>"
  if (option['Progress roll']?.['Track']) {
    return `Roll +${option['Progress roll']['Track']}.`
  }

  // Continue a legacy: "Roll all of Quests Legacy, ..."
  if (option['Progress roll']?.['All of']) {
    return 'Roll all of ' + option['Progress roll']['All of'].join(', ')
  }

  const unifiedRoll = option['Progress roll'] || option['Action roll']
  if (!unifiedRoll) {
    console.log('Thats weird', option)
    return ''
  }

  // e.g. Endure Harm: "Roll <best/worst> of ((rollplus stat)), ..."
  const fooOf = unifiedRoll['Best of'] || unifiedRoll['Worst of']
  if (fooOf) {
    const k = unifiedRoll['Best of'] ? 'best of' : 'worst of'
    return `Roll ${k} ${fooOf.map((x) => `((rollplus ${x.toLowerCase()}))`)}`
  }

  // Every other thing: Roll +<stat>
  if (unifiedRoll['Track']) {
    return `Roll +${unifiedRoll['Track']}`
  } else {
    return `${option.Text}: ((rollplus ${unifiedRoll['Stat']}))`
  }
}

function textForMoveTriggerOptions(trigger: MoveTrigger): string {
  console.log(trigger)
  let ret = trigger.Text

  if (!trigger.Options || trigger.Options.length === 0) {
    return ret
  }

  if (trigger.Options.length === 1) {
    ret += ` ${textForMoveTriggerOption(trigger.Options[0])}`
  } else {
    ret = `<p>${ret}</p>\n<ul>`
    for (const option of trigger.Options) {
      ret += `<li>${textForMoveTriggerOption(option)}`
    }
    ret += '</ul>'
  }

  return ret
}

function statsForMove(move: any): string[] {
  const options = move['Trigger']?.Options as MoveTriggerOption[] | undefined
  if (!options) return []

  const ret = [] as string[]
  for (const option of options) {
    const actionRoll = option['Action roll']
    if (!actionRoll) continue

    const fooOf = actionRoll['All of'] || actionRoll['Best of'] || actionRoll['Worst of']
    if (fooOf) {
      ret.push(...fooOf)
    } else if (actionRoll.Stat) {
      ret.push(actionRoll.Stat)
    }
  }
  return ret.map(x => x.toLowerCase())
}

const PACKS = ['foundry-ironsworn.starforgedassets', 'foundry-ironsworn.starforgedencounters', 'foundry-ironsworn.starforgedmoves', 'foundry-ironsworn.starforgedoracles', 'foundry-ironsworn.foeactorssf']
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
    const idsToDelete = pack.index.map((x) => x._id)
    await Item.deleteDocuments(idsToDelete, { pack: key })
  }

  const idMap = await fetch('systems/foundry-ironsworn/assets/sf-ids.json').then((x) => x.json())

  // Moves
  const movesJson = await fetch('systems/foundry-ironsworn/assets/sf-moves.json').then((x) => x.json())
  const movesToCreate = [] as (ItemDataConstructorData & Record<string, unknown>)[]
  for (const move of movesJson) {
    // "description" is what shows up in the roll-this-move dialog
    // We reconstruct it here from the options available
    const description = textForMoveTriggerOptions(move.Trigger)

    movesToCreate.push({
      _id: idMap[move['$id']],
      type: 'move',
      name: move['Name'],
      img: 'icons/dice/d10black.svg',
      data: {
        fulltext: move['Text'],
        description,
        strong: move['Outcomes']?.['Strong Hit']?.['Text'],
        strongmatch: move['Outcomes']?.['Strong Hit']?.['With a Match']?.['Text'],
        weak: move['Outcomes']?.['Weak Hit']?.['Text'],
        miss: move['Outcomes']?.['Miss']?.['Text'],
        missmatch: move['Outcomes']?.['Miss']?.['With a Match']?.['Text'],
        stats: statsForMove(move),
        sourceId: move['$id'],
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
      fields:
        asset['Input']?.map((name) => ({
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
  const oraclesToCreate = [] as Record<string, unknown>[]
  // Oracles JSON is a tree we wish to iterate through depth first adding
  // parents prior to their children, and children in order
  const nodeStack = Array.from(oraclesJson).reverse() as any[]
  while (nodeStack.length) {
    const node = nodeStack.pop() as Record<string, any>
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
        results: node['Table'].map(
          (tableRow) =>
            ({
              range: [tableRow['Floor'], tableRow['Ceiling']],
              text: tableRow['Result'],
            } as Record<string, unknown>)
        ),
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
