import { ItemDataConstructorData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/itemData'
import { IronswornActor } from './actor/actor'
import { cloneDeep, get, isArray, isObject, max, set } from 'lodash'
import { data as Dataforged, IMove, IOracle, IOracleCategory } from 'dataforged'
import { marked } from 'marked'
import { IronswornItem } from './item/item'
import shajs from 'sha.js'

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

function hash(str: string): string {
  return shajs('sha256').update(str).digest('hex').substring(48)
}

export async function getFoundryTableByDfId(dfid: string): Promise<RollTable | undefined> {
  const pack = game.packs.get('foundry-ironsworn.starforgedoracles')
  return (await pack?.getDocument(hashLookup(dfid))) || undefined
}

export async function getFoundryMoveByDfId(dfid: string): Promise<IronswornItem | undefined> {
  const pack = game.packs.get('foundry-ironsworn.starforgedmoves')
  return (await pack?.getDocument(hashLookup(dfid))) as IronswornItem | undefined
}

export async function getDFMoveByDfId(dfid: string): Promise<IMove | undefined> {
  for (const category of Dataforged.moves) {
    for (const move of category.Moves) {
      if (move.$id === dfid) return move
    }
  }
  return undefined
}

function generateIdMap(data: typeof Dataforged): { [key: string]: string } {
  const ret = {}

  const nodeStack = cloneDeep(Object.values(data)) as any[]
  while (nodeStack.length) {
    const node = nodeStack.pop()
    if (node?.$id) {
      ret[node.$id] = hash(node.$id)
    }
    if (isArray(node)) {
      nodeStack.push(...node.reverse())
    } else if (node instanceof Object) {
      nodeStack.push(...Object.values(node).reverse())
    }
  }

  return ret
}

const COMPENDIUM_KEY_MAP = {
  Moves: 'starforgedmoves',
  Oracles: 'starforgedoracles',
}
const MARKDOWN_LINK_RE = new RegExp('\\[(.*?)\\]\\((.*?)\\)', 'g')

function renderLinksInStr(text: any, idMap: { [key: string]: string }): any {
  return text.replace(MARKDOWN_LINK_RE, (match, text, url) => {
    const [kind] = url.split('/')
    const compendiumKey = COMPENDIUM_KEY_MAP[kind]
    if (!compendiumKey) return match
    return `@Compendium[foundry-ironsworn.${compendiumKey}.${idMap[url]}]{${text}}`
  })
}

function renderMarkdown(md: string, idMap: { [key: string]: string }, markedFn = marked.parse) {
  return markedFn(renderLinksInStr(md, idMap))
}

function renderLinksInMove(idMap: { [key: string]: string }, move: IMove) {
  const textProperties = ['Text', 'Trigger.Text', 'Outcomes.Strong Hit.Text', 'Outcomes.Strong Hit.With a Match.Text', 'Outcomes.Weak Hit.Text', 'Outcomes.Miss.Text', 'Outcomes.Miss.With a Match.Text']
  for (const prop of textProperties) {
    const text = get(move, prop)
    if (!text) continue
    set(move, prop, renderLinksInStr(text, idMap))
  }
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

  const idMap = generateIdMap(Dataforged)

  await processMoves(idMap)
  await processAssets(idMap)
  await processOracles(idMap)

  // Encounters
  const encountersToCreate = [] as (ItemDataConstructorData & Record<string, unknown>)[]
  for (const encounter of Dataforged.encounters) {
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
}

async function processOracles(idMap: { [key: string]: string }) {
  const oraclesToCreate = [] as Record<string, unknown>[]
  // Oracles JSON is a tree we wish to iterate through depth first adding
  // parents prior to their children, and children in order
  async function processOracle(oracle: IOracle) {
    if (oracle.Table) {
      const description = marked.parseInline(renderLinksInStr(oracle.Description ?? '', idMap))
      const maxRoll = max(oracle.Table.map((x) => x.Ceiling || 0)) //oracle.Table && maxBy(oracle.Table, (x) => x.Ceiling)?.Ceiling
      oraclesToCreate.push({
        _id: idMap[oracle.$id],
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
        results: oracle.Table?.map((tableRow) => ({
          range: [tableRow.Floor, tableRow.Ceiling],
          text: tableRow.Result && renderLinksInStr(tableRow.Result, idMap),
        })).filter((x) => x.range[0] !== null),
      })
    }

    for (const child of oracle.Oracles ?? [])
      await processOracle(child)
  }
  async function processCategory(cat: IOracleCategory) {
    for (const oracle of cat.Oracles ?? [])
      await processOracle(oracle)
    for (const child of cat.Categories ?? [])
      await processCategory(child)
  }

  for (const category of Dataforged.oracles) {
    await processCategory(category)
  }
  await RollTable.createDocuments(oraclesToCreate, { pack: 'foundry-ironsworn.starforgedoracles', keepId: true })
}

async function processAssets(idMap: { [key: string]: string }) {
  const assetsToCreate = [] as (ItemDataConstructorData & Record<string, unknown>)[]
  for (const assetType of Dataforged.assets) {
    for (const asset of assetType.Assets) {
      assetsToCreate.push({
        type: 'asset',
        _id: idMap[asset.$id],
        name: `${assetType.Name} / ${asset.Name}`,
        data: {
          description: renderMarkdown(assetType.Description, idMap),
          fields: asset.Inputs?.map((input) => ({
            name: input.Name,
            value: '',
          })) || [],
          abilities: (asset.Abilities ?? []).map((ability) => ({
            enabled: ability.Enabled || false,
            description: renderMarkdown(ability.Text, idMap),
          })),
          track: {
            enabled: !!asset['Condition Meter'],
            name: asset['Condition Meter']?.Name,
            current: asset['Condition Meter']?.['Starting Value'],
            max: asset['Condition Meter']?.Max,
          },
          exclusiveOptions: [], // TODO:
        },
      })
    }
  }
  await Item.createDocuments(assetsToCreate, { pack: 'foundry-ironsworn.starforgedassets', keepId: true })
}

async function processMoves(idMap: { [key: string]: string }) {
  const movesToCreate = [] as (ItemDataConstructorData & Record<string, unknown>)[]
  for (const category of Dataforged.moves) {
    for (const move of category.Moves) {
      renderLinksInMove(idMap, move)
      const cleanMove = cleanDollars(move)
      movesToCreate.push({
        _id: idMap[cleanMove['dfid']],
        type: 'sfmove',
        name: cleanMove['Name'],
        img: 'icons/dice/d10black.svg',
        data: cleanMove,
      })
    }
  }
  await Item.createDocuments(movesToCreate, { pack: 'foundry-ironsworn.starforgedmoves', keepId: true })
}
