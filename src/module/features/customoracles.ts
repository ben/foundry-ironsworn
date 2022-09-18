import {
  starforged,
  ironsworn,
  IOracle,
  IOracleCategory,
  Starforged,
  Ironsworn,
} from 'dataforged'
import { compact } from 'lodash'
import { getFoundryTableByDfId } from '../dataforged'
import { cachedDocumentsForPack } from './pack-cache'

export interface IOracleTreeNode {
  dataforgedNode?: IOracle | IOracleCategory
  tables: RollTable[] | any[]
  displayName: string
  children: IOracleTreeNode[]
  forceExpanded?: boolean
  forceHidden?: boolean
}

// For some reason, rollupJs mangles this
const SFOracleCategories = ((starforged as any).default as Starforged)[
  'Oracle Categories'
]
const ISOracleCategories = ((ironsworn as any).default as Ironsworn)[
  'Oracle Categories'
]

const emptyNode = () =>
  ({
    displayName: '',
    tables: [],
    children: [],
  } as IOracleTreeNode)

async function createOracleTree(
  compendium: string,
  categories: IOracleCategory[]
): Promise<IOracleTreeNode> {
  const rootNode = emptyNode()

  // Make sure the compendium is loaded
  await cachedDocumentsForPack(compendium)

  // Build the default tree
  for (const category of categories) {
    rootNode.children.push(await walkOracleCategory(category))
  }

  // Add in custom oracles from a well-known directory
  await augmentWithFolderContents(rootNode)

  // Fire the hook and allow extensions to modify the tree
  await Hooks.call('ironswornOracles', rootNode)

  // Prevent Vue from adding reactivity to Foundry objects
  walkAndFreezeTables(rootNode)

  return rootNode
}

export async function createIronswornOracleTree(): Promise<IOracleTreeNode> {
  return createOracleTree(
    'foundry-ironsworn.ironswornoracles',
    ISOracleCategories
  )
}

export async function createStarforgedOracleTree(): Promise<IOracleTreeNode> {
  return createOracleTree(
    'foundry-ironsworn.starforgedoracles',
    SFOracleCategories
  )
}

async function walkOracleCategory(
  cat: IOracleCategory
): Promise<IOracleTreeNode> {
  const node: IOracleTreeNode = {
    ...emptyNode(),
    dataforgedNode: cat,
    displayName: game.i18n.localize(`IRONSWORN.OracleCategories.${cat.Name}`),
  }

  for (const childCat of cat.Categories ?? []) {
    node.children.push(await walkOracleCategory(childCat))
  }
  for (const oracle of cat.Oracles ?? []) {
    node.children.push(await walkOracle(oracle))
  }

  // Promote children of nodes that have a table
  for (const child of node.children) {
    if (child.tables.length > 0) {
      node.children = [...node.children, ...child.children]
      child.children = []
    }
  }

  return node
}

export async function walkOracle(
  oracle?: IOracle | IOracleCategory
): Promise<IOracleTreeNode> {
  if (!oracle) return emptyNode()

  const table = await getFoundryTableByDfId(oracle.$id)

  const node: IOracleTreeNode = {
    ...emptyNode(),
    dataforgedNode: oracle,
    tables: compact([table]),
    displayName:
      table?.name ||
      game.i18n.localize(`IRONSWORN.OracleCategories.${oracle.Name}`),
  }

  // Child oracles
  for (const childOracle of oracle.Oracles ?? []) {
    node.children.push(await walkOracle(childOracle))
  }

  // Subtables on results
  for (const entry of oracle.Table ?? []) {
    const name = entry.Result
    if (entry.Subtable) {
      const subtable = await getFoundryTableByDfId(`${oracle.$id}/${name}`)
      if (subtable) {
        node.children.push({
          ...emptyNode(),
          displayName: name,
          tables: [subtable],
        })
      }
    }
  }

  // Promote children of nodes that have a table
  for (const child of node.children) {
    if (child.tables.length > 0) {
      node.children = [...node.children, ...child.children]
      child.children = []
    }
  }

  return node
}

async function augmentWithFolderContents(node: IOracleTreeNode) {
  const name = game.i18n.localize('IRONSWORN.Custom Oracles')
  const rootFolder = game.tables?.directory?.folders.find(
    (x) => x.name === name
  )
  if (!rootFolder) return

  function walkFolder(parent: IOracleTreeNode, folder: Folder) {
    // Add this folder
    const newNode: IOracleTreeNode = {
      ...emptyNode(),
      displayName: folder.name || '(folder)',
    }
    parent.children.push(newNode)

    // Add its folder children
    for (const sub of folder.getSubfolders()) {
      walkFolder(newNode, sub)
    }

    // Add its table children
    for (const table of folder.contents) {
      newNode.children.push({
        ...emptyNode(),
        tables: [table as RollTable],
        displayName: table.name ?? '(table)',
      })
    }
  }

  walkFolder(node, rootFolder)
}

export function walkAndFreezeTables(node: IOracleTreeNode) {
  ;(node.tables as any) = Object.freeze(node.tables)
  for (const child of node.children) {
    walkAndFreezeTables(child)
  }
}

export function findPathToNodeByTableId(
  rootNode: IOracleTreeNode,
  tableId: string
): IOracleTreeNode[] {
  const ret: IOracleTreeNode[] = []
  function walk(node: IOracleTreeNode) {
    ret.push(node)
    const foundTable = node.tables.find((x) => x.id === tableId)
    if (foundTable) return true
    for (const child of node.children) {
      if (walk(child)) return true
    }
    ret.pop()
    return false
  }

  walk(rootNode)
  return ret
}

export function findPathToNodeByDfId(rootNode: IOracleTreeNode, dfId: string) {
  const ret: IOracleTreeNode[] = []
  function walk(node: IOracleTreeNode) {
    ret.push(node)
    if (node.dataforgedNode?.$id === dfId) return true
    for (const child of node.children) {
      if (walk(child)) return true
    }
    ret.pop()
    return false
  }

  walk(rootNode)
  return ret
}
