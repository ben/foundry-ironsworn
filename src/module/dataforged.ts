import { ItemDataConstructorData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/itemData'
import { IronswornActor } from './actor/actor'
import { cloneDeep, get, isArray, isObject, max, set } from 'lodash'
import {
  starforged,
  IMove,
  IOracle,
  IOracleCategory,
  IInputClock,
  Starforged,
} from 'dataforged'
import { marked } from 'marked'
import { IronswornItem } from './item/item'
import shajs from 'sha.js'
import { cachedDocumentsForPack } from './features/pack-cache'
import { RollTableDataConstructorData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/rollTableData.js'
import { TableResultDataConstructorData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/tableResultData.js'

// For some reason, rollupJs mangles this
const MoveCategories = (starforged.default as Starforged)['Move Categories']
const OracleCategories = (starforged.default as Starforged)['Oracle Categories']
const AssetTypes = (starforged.default as Starforged)['Asset Types']

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

export function hash(str: string): string {
  return shajs('sha256').update(str).digest('hex').substring(48)
}

export async function getFoundryTableByDfId(
  dfid: string
): Promise<StoredDocument<RollTable> | undefined> {
  const isd = await cachedDocumentsForPack('foundry-ironsworn.ironswornoracles')
  const sfd = await cachedDocumentsForPack(
    'foundry-ironsworn.starforgedoracles'
  )
  const matcher = (x) => x.id === hashLookup(dfid)
  return (isd?.find(matcher) ?? sfd?.find(matcher)) as
    | StoredDocument<RollTable>
    | undefined
}

export async function getFoundryMoveByDfId(
  dfid: string
): Promise<IronswornItem | undefined> {
  const documents = await cachedDocumentsForPack(
    'foundry-ironsworn.starforgedmoves'
  )
  return documents?.find((x) => x.id === hashLookup(dfid)) as
    | IronswornItem
    | undefined
}

export async function getDFMoveByDfId(
  dfid: string
): Promise<IMove | undefined> {
  for (const category of MoveCategories) {
    for (const move of category.Moves) {
      if (move.$id === dfid) return move
    }
  }
  return undefined
}

export function getDFOracleByDfId(
  dfid: string
): IOracle | IOracleCategory | undefined {
  const nodes = findOracleWithIntermediateNodes(dfid)
  return nodes[nodes.length - 1]
}

export function findOracleWithIntermediateNodes(
  dfid: string
): Array<IOracle | IOracleCategory> {
  const ret: Array<IOracle | IOracleCategory> = []

  function walkCategory(cat: IOracleCategory): boolean {
    ret.push(cat)

    if (cat.$id === dfid) return true
    for (const oracle of cat.Oracles ?? []) {
      if (walkOracle(oracle)) return true
    }
    for (const childCat of cat.Categories ?? []) {
      if (walkCategory(childCat)) return true
    }

    ret.pop()
    return false
  }

  function walkOracle(oracle: IOracle): boolean {
    ret.push(oracle)

    if (oracle.$id === dfid) return true
    for (const childOracle of oracle.Oracles ?? []) {
      if (walkOracle(childOracle)) return true
    }

    ret.pop()
    return false
  }

  for (const cat of OracleCategories) {
    walkCategory(cat)
  }
  return ret
}

function generateIdMap(data: typeof starforged): { [key: string]: string } {
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
  'Ironsworn/Moves': 'ironswornmoves',
  'Ironsworn/Oracles': 'ironswornoracles',
  'Starforged/Moves': 'starforgedmoves',
  'Starforged/Oracles': 'starforgedoracles',
  'Starforged/Encounters': 'starforgedencounters',
}
const MARKDOWN_LINK_RE = new RegExp('\\[(.*?)\\]\\((.*?)\\)', 'g')
const DESCRIPTOR_FOCUS_RE = new RegExp('\\[Descriptor \\+ Focus\\]\\(.*?\\)')
const ACTION_THEME_RE = new RegExp('\\[Action \\+ Theme\\]\\(.*?\\)')

function idIsOracleLink(dfid: string): boolean {
  return /^(Starforged|Ironsworn)\/Oracle/.test(dfid)
}

function renderLinksInStr(text: string): string {
  // Strip "Black Medium Right-Pointing Triangle" characters
  text = text.replace('\u23f5', '')

  // Strip brackets from e.g. factions/name template
  text = text.replace(/\[(\[.*?\))\]/g, '$1')

  // Catch "Descriptor+Focus" or "Action+Theme" and replace with two links
  text = text.replace(
    DESCRIPTOR_FOCUS_RE,
    '[Descriptor](Starforged/Oracles/Core/Descriptor) + [Focus](Starforged/Oracles/Core/Focus)'
  )
  text = text.replace(
    ACTION_THEME_RE,
    '[Action](Starforged/Oracles/Core/Action) + [Theme](Starforged/Oracles/Core/Theme)'
  )

  return text.replace(MARKDOWN_LINK_RE, (match, text, url) => {
    const parts = url.split('/')
    const kind = `${parts[0]}/${parts[1]}`
    const compendiumKey = COMPENDIUM_KEY_MAP[kind]
    if (!compendiumKey) return match
    if (idIsOracleLink(url)) {
      return `<a class="entity-link oracle-category-link" data-dfid="${url}"><i class="fa fa-caret-right"></i> ${text}</a>`
    }
    return `@Compendium[foundry-ironsworn.${compendiumKey}.${hash(
      url
    )}]{${text}}`
  })
}

function renderMarkdown(md: string, markedFn = marked.parse) {
  return markedFn(renderLinksInStr(md))
}

export function renderLinksInMove(move: IMove) {
  const textProperties = [
    'Text',
    'Trigger.Text',
    'Outcomes.Strong Hit.Text',
    'Outcomes.Strong Hit.With a Match.Text',
    'Outcomes.Weak Hit.Text',
    'Outcomes.Miss.Text',
    'Outcomes.Miss.With a Match.Text',
  ]
  for (const prop of textProperties) {
    const text = get(move, prop)
    if (!text) continue
    set(move, prop, renderLinksInStr(text))
  }
}

const PACKS = [
  'foundry-ironsworn.starforgedassets',
  'foundry-ironsworn.starforgedencounters',
  'foundry-ironsworn.starforgedmoves',
  'foundry-ironsworn.starforgedoracles',
  'foundry-ironsworn.foeactorssf',
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
    const idsToDelete = pack.index.map((x) => x._id)
    await Item.deleteDocuments(idsToDelete, { pack: key })
  }

  const idMap = generateIdMap(starforged)

  await processMoves(idMap)
  await processAssets(idMap)
  await processOracles(idMap)
  await processEncounters(idMap)
  await processFoes()
}

async function processMoves(idMap: { [key: string]: string }) {
  const movesToCreate = [] as (ItemDataConstructorData &
    Record<string, unknown>)[]
  for (const category of MoveCategories) {
    for (const move of category.Moves) {
      renderLinksInMove(move)
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
  await Item.createDocuments(movesToCreate, {
    pack: 'foundry-ironsworn.starforgedmoves',
    keepId: true,
  })
}

async function processAssets(idMap: { [key: string]: string }) {
  const assetsToCreate = [] as (ItemDataConstructorData &
    Record<string, unknown>)[]
  for (const assetType of AssetTypes) {
    for (const asset of assetType.Assets) {
      assetsToCreate.push({
        type: 'asset',
        _id: idMap[asset.$id],
        name: `${assetType.Name} / ${asset.Name}`,
        data: {
          description: renderMarkdown(assetType.Description),
          fields:
            asset.Inputs?.map((input) => ({
              name: input.Name,
              value: '',
            })) || [],
          abilities: (asset.Abilities ?? []).map((ability) => {
            const ret = {
              enabled: ability.Enabled || false,
              description: renderMarkdown(ability.Text),
            } as any

            for (const input of ability.Inputs ?? []) {
              if (input['Input Type'] === 'Clock') {
                const ic = input as IInputClock
                ret.hasClock = true
                ret.clockMax = ic.Segments
                ret.clockTicks = ic.Filled
              }
              // TODO: other input types
            }

            return ret
          }),
          track: {
            enabled: !!asset['Condition Meter'],
            name: asset['Condition Meter']?.Name,
            current: asset['Condition Meter']?.Value,
            max: asset['Condition Meter']?.Max,
          },
          exclusiveOptions: [], // TODO:
        },
      })
    }
  }
  await Item.createDocuments(assetsToCreate, {
    pack: 'foundry-ironsworn.starforgedassets',
    keepId: true,
  })
}

async function processOracles(idMap: { [key: string]: string }) {
  const oraclesToCreate: RollTableDataConstructorData[] = []
  // Oracles JSON is a tree we wish to iterate through depth first adding
  // parents prior to their children, and children in order
  async function processOracle(oracle: IOracle) {
    if (oracle.Table) {
      const description = marked.parseInline(
        renderLinksInStr(oracle.Description ?? '')
      )
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
        results: oracle.Table?.map((tableRow) => {
          let text: string
          if (tableRow.Result && tableRow.Summary) {
            text = `${tableRow.Result} (${tableRow.Summary})`
          } else text = tableRow.Result ?? ''
          return {
            _id: idMap[tableRow.$id ?? ''],
            range: [tableRow.Floor, tableRow.Ceiling],
            text: tableRow.Result && renderLinksInStr(text),
          } as TableResultDataConstructorData
        }).filter((x) => x.range[0] !== null),
      })
    }

    for (const child of oracle.Oracles ?? []) await processOracle(child)
  }
  async function processCategory(cat: IOracleCategory) {
    for (const oracle of cat.Oracles ?? []) await processOracle(oracle)
    for (const child of cat.Categories ?? []) await processCategory(child)
  }

  for (const category of OracleCategories) {
    await processCategory(category)
  }
  await RollTable.createDocuments(oraclesToCreate, {
    pack: 'foundry-ironsworn.starforgedoracles',
    keepId: true,
  })
}

async function processEncounters(idMap: { [key: string]: string }) {
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
      _id: idMap[encounter['$id']],
      type: 'progress',
      name: encounter['Name'],
      data: {
        description,
        rank: getLegacyRank(encounter['Rank']),
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
        _id: idMap[variant['$id']],
        type: 'progress',
        name: variant['Name'],
        data: {
          description: variantDescription,
          rank: getLegacyRank(
            'Rank' in variant ? variant['Rank'] : encounter['Rank']
          ),
        },
      })
    }
  }
  await Item.createDocuments(encountersToCreate, {
    pack: 'foundry-ironsworn.starforgedencounters',
    keepId: true,
  })
}

async function processFoes() {
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
