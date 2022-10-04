import { ItemDataConstructorData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/itemData'
import { RollTableDataConstructorData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/rollTableData'
import { TableResultDataConstructorData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/tableResultData'
import {
  IAssetType,
  IMoveCategory,
  IOracle,
  IOracleCategory,
  starforged,
} from 'dataforged'
import { isArray, isObject, max } from 'lodash'
import { marked } from 'marked'
import shajs from 'sha.js'
import { renderLinksInMove, renderLinksInStr } from '.'
import { IronswornActor } from '../actor/actor'
import { IronswornItem } from '../item/item'
import {
  ISAssetTypes,
  ISMoveCategories,
  ISOracleCategories,
  SFAssetTypes,
  SFMoveCategories,
  SFOracleCategories,
} from './data'
import { DATAFORGED_ICON_MAP } from './images'
import { renderMarkdown } from './rendering'

export enum NumericRank {
  'troublesome' = 1,
  'dangerous' = 2,
  'formidable' = 3,
  'extreme' = 4,
  'epic' = 5,
}

export function cleanDollars(obj): any {
  if (isArray(obj)) {
    const ret = [] as any[]
    for (const item of obj) {
      ret.push(cleanDollars(item))
    }
    return ret
  } else if (isObject(obj)) {
    const ret = {} as any
    for (const k of Object.keys(obj)) {
      let newK = k
      if (newK.startsWith('$')) {
        newK = 'df' + k.substring(1)
      }
      ret[newK] = cleanDollars(obj[k])
    }
    return ret
  }
  return obj
}

const HASH_CACHE = {} as { [k: string]: string }
export function hashLookup(str: string): string {
  HASH_CACHE[str] ||= hash(str)
  return HASH_CACHE[str]
}

export function hash(str: string): string {
  return shajs('sha256').update(str).digest('hex').substring(48)
}

const PACKS = [
  'foundry-ironsworn.starforgedassets',
  'foundry-ironsworn.starforgedencounters',
  'foundry-ironsworn.starforgedmoves',
  'foundry-ironsworn.starforgedoracles',
  'foundry-ironsworn.foeactorssf',
  'foundry-ironsworn.ironswornassets',
  'foundry-ironsworn.ironswornoracles',
  'foundry-ironsworn.ironswornmoves',
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

    // Unlock all the packs
    await pack.configure({ locked: false })

    // Delete all the contents
    const idsToDelete = pack.index.map((x) => x._id)
    await Item.deleteDocuments(idsToDelete, { pack: key })
  }

  await processSFMoves()
  await processSFAssets()
  await processISAssets()
  await processSFOracles()
  await processSFEncounters()
  await processSFFoes()

  await processISMoves()
  await processISOracles()

  // Lock the packs again
  for (const key of PACKS) {
    await game.packs.get(key)?.configure({ locked: true })
  }
}

/**
 * MOVES
 */

function movesForCategories(
  categories: IMoveCategory[]
): (ItemDataConstructorData & Record<string, unknown>)[] {
  const movesToCreate = [] as (ItemDataConstructorData &
    Record<string, unknown>)[]
  for (const category of categories) {
    for (const move of category.Moves) {
      renderLinksInMove(move)
      const cleanMove = cleanDollars(move)
      console.log(move.Name, move.$id)
      movesToCreate.push({
        _id: hashLookup(cleanMove['dfid']),
        type: 'sfmove',
        name: move.Name,
        img: 'icons/dice/d10black.svg',
        data: cleanMove,
      })
    }
  }
  return movesToCreate
}

async function processISMoves() {
  const movesToCreate = movesForCategories(ISMoveCategories)
  await Item.createDocuments(movesToCreate, {
    pack: 'foundry-ironsworn.ironswornmoves',
    keepId: true,
  })
}
async function processSFMoves() {
  const movesToCreate = movesForCategories(SFMoveCategories)
  await Item.createDocuments(movesToCreate, {
    pack: 'foundry-ironsworn.starforgedmoves',
    keepId: true,
  })
}

/**
 * ASSSETS
 */

function assetsForTypes(types: IAssetType[]) {
  const assetsToCreate = [] as (ItemDataConstructorData &
    Record<string, unknown>)[]
  for (const assetType of types) {
    for (const asset of assetType.Assets) {
      // Inputs map to fields and exclusive options
      const fields = [] as { name: string; value: string }[]
      const exclusiveOptions = [] as { name: string; selected: boolean }[]
      // TODO: "Number"
      for (const input of asset.Inputs ?? []) {
        if (input['Input Type'] === 'Text') {
          fields.push({ name: input.Name, value: '' })
        }
        if (input['Input Type'] === 'Select') {
          for (const option of input.Options) {
            exclusiveOptions.push({ name: option.Name, selected: false })
          }
        }
      }

      const data = {
        requirement: renderMarkdown(asset.Requirement ?? ''),
        category: assetType.Name,
        color: assetType.Display.Color ?? '',
        fields,
        abilities: (asset.Abilities ?? []).map((ability) => {
          const ret = {
            enabled: ability.Enabled || false,
            description: renderMarkdown(ability.Text),
          } as any

          for (const input of ability.Inputs ?? []) {
            if (input['Input Type'] === 'Clock') {
              const ic = input
              ret.hasClock = true
              ret.clockMax = ic.Segments
              ret.clockTicks = ic.Filled
            }
          }

          return ret
        }),
        track: {
          enabled: !!asset['Condition Meter'],
          name: asset['Condition Meter']?.Name,
          current: asset['Condition Meter']?.Value,
          max: asset['Condition Meter']?.Max,
        },
        exclusiveOptions,
      }
      assetsToCreate.push({
        type: 'asset',
        _id: hashLookup(asset.$id),
        name: asset.Name,
        data: data,
      })
    }
  }
  return assetsToCreate
}

async function processSFAssets() {
  const assetsToCreate = assetsForTypes(SFAssetTypes)
  await Item.createDocuments(assetsToCreate, {
    pack: 'foundry-ironsworn.starforgedassets',
    keepId: true,
  })
}

async function processISAssets() {
  const assetsToCreate = assetsForTypes(ISAssetTypes)
  await Item.createDocuments(assetsToCreate, {
    pack: 'foundry-ironsworn.ironswornassets',
    keepId: true,
  })
}

/**
 * ORACLES
 */
async function processOracle(
  oracle: IOracle,
  output: RollTableDataConstructorData[]
) {
  // Oracles JSON is a tree we wish to iterate through depth first adding
  // parents prior to their children, and children in order
  if (oracle.Table) {
    const description = marked.parseInline(
      renderLinksInStr(oracle.Description ?? '')
    )
    const maxRoll = max(oracle.Table.map((x) => x.Ceiling || 0)) //oracle.Table && maxBy(oracle.Table, (x) => x.Ceiling)?.Ceiling
    output.push({
      _id: hashLookup(oracle.$id),
      flags: {
        dfId: oracle.$id,
        category: oracle.Category,
      },
      name: oracle.Name,
      img: 'icons/dice/d10black.svg',
      description,
      formula: `d${maxRoll}`,
      replacement: true,
      displayRoll: true,
      /* folder: // would require using an additional module */
      results: oracle.Table?.map((tableRow) => {
        let text: string
        if (tableRow.Result && tableRow.Summary) {
          text = `${tableRow.Result} (${tableRow.Summary})`
        } else text = tableRow.Result ?? ''
        return {
          _id: hashLookup(tableRow.$id ?? ''),
          range: [tableRow.Floor, tableRow.Ceiling],
          text: tableRow.Result && renderLinksInStr(text),
        } as TableResultDataConstructorData
      }).filter((x) => x.range[0] !== null),
    })
  }

  for (const child of oracle.Oracles ?? []) await processOracle(child, output)
}
async function processOracleCategory(
  cat: IOracleCategory,
  output: RollTableDataConstructorData[]
) {
  for (const oracle of cat.Oracles ?? []) await processOracle(oracle, output)
  for (const child of cat.Categories ?? [])
    await processOracleCategory(child, output)
}

async function processSFOracles() {
  const oraclesToCreate: RollTableDataConstructorData[] = []

  for (const category of SFOracleCategories) {
    await processOracleCategory(category, oraclesToCreate)
  }
  await RollTable.createDocuments(oraclesToCreate, {
    pack: 'foundry-ironsworn.starforgedoracles',
    keepId: true,
  })
}

async function processISOracles() {
  const oraclesToCreate: RollTableDataConstructorData[] = []

  for (const category of ISOracleCategories) {
    await processOracleCategory(category, oraclesToCreate)
  }
  await RollTable.createDocuments(oraclesToCreate, {
    pack: 'foundry-ironsworn.ironswornoracles',
    keepId: true,
  })
}

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

async function processSFEncounters() {
  const encountersToCreate = [] as (ItemDataConstructorData &
    Record<string, unknown>)[]
  for (const encounter of starforged.Encounters) {
    const description = await renderTemplate(
      'systems/foundry-ironsworn/templates/item/sf-foe.hbs',
      {
        ...encounter,
        variantLinks: encounter.Variants.map((x) =>
          renderLinksInStr(`[${x.Name}](${x.$id})`)
        ),
      }
    )

    encountersToCreate.push({
      _id: hashLookup(encounter.$id),
      type: 'progress',
      name: encounter['Name'],
      img: DATAFORGED_ICON_MAP.starforged.foe[encounter.$id],
      data: {
        description,
        rank: NumericRank[encounter['Rank']] as keyof typeof NumericRank,
      },
    })

    for (const variant of encounter['Variants']) {
      const variantDescription = await renderTemplate(
        'systems/foundry-ironsworn/templates/item/sf-foe.hbs',
        {
          ...encounter,
          ...variant,
          Category: variant['Nature'] || encounter['Nature'],
          CategoryDescription: variant['Summary'] || encounter['Summary'],
        }
      )

      encountersToCreate.push({
        _id: hashLookup(variant['$id']),
        type: 'progress',
        name: variant['Name'],
        img: DATAFORGED_ICON_MAP.starforged.foe[variant.$id],
        data: {
          description: variantDescription,
          rank: NumericRank[
            'Rank' in variant ? variant['Rank'] : encounter['Rank']
          ] as keyof typeof NumericRank,
        },
      })
    }
  }
  await Item.createDocuments(encountersToCreate, {
    pack: 'foundry-ironsworn.starforgedencounters',
    keepId: true,
  })
}

async function processSFFoes() {
  const foesPack = game.packs.get('foundry-ironsworn.starforgedencounters')
  const foeItems =
    (await foesPack?.getDocuments()) as StoredDocument<IronswornItem>[]
  for (const foeItem of foeItems ?? []) {
    const actor = await IronswornActor.create(
      {
        name: foeItem.name ?? 'wups',
        img: foeItem.data.img,
        type: 'foe',
      },
      { pack: 'foundry-ironsworn.foeactorssf' }
    )
    await actor?.createEmbeddedDocuments('Item', [
      foeItem.data as unknown as Record<string, unknown>,
    ])
  }
}
