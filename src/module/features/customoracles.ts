import { starforged, ironsworn, IOracle, IOracleCategory } from 'dataforged'
import { compact } from 'lodash'
import { getFoundryISTableByDfId, getFoundrySFTableByDfId } from '../dataforged'
import { cachedDocumentsForPack } from './pack-cache'

export interface OracleTreeNode {
  dataforgedNode?: IOracle | IOracleCategory
  tables: RollTable[]
  displayName: string
  children: OracleTreeNode[]
  forceExpanded?: boolean
  forceHidden?: boolean
}

// For some reason, rollupJs mangles this
const SFOracleCategories = starforged.default['Oracle Categories']
const ISOracleCategories = ironsworn.default['Oracle Categories']

const emptyNode = () =>
  ({
    displayName: '',
    tables: [],
    children: [],
  } as OracleTreeNode)

async function createOracleTree(
  compendium: string,
  categories: IOracleCategory[],
  tableGetter: (dfid: string) => Promise<StoredDocument<RollTable> | undefined>
): Promise<OracleTreeNode> {
  const rootNode = emptyNode()

  // Make sure the compendium is loaded
  await cachedDocumentsForPack(compendium)

  // Build the default tree
  for (const category of categories) {
    rootNode.children.push(await walkOracleCategory(category, tableGetter))
  }

  // Add in custom oracles from a well-known directory
  await augmentWithFolderContents(rootNode)

  // Fire the hook and allow extensions to modify the tree
  await Hooks.call('ironswornOracles', rootNode)

  // Prevent Vue from adding reactivity to Foundry objects
  walkAndFreezeTables(rootNode)

  return rootNode
}

export async function createIronswornOracleTree(): Promise<OracleTreeNode> {
  return createOracleTree(
    'foundry-ironsworn.ironswornoracles',
    ISOracleCategories,
    getFoundryISTableByDfId
  )
}

export async function createStarforgedOracleTree(): Promise<OracleTreeNode> {
  return createOracleTree(
    'foundry-ironsworn.starforgedoracles',
    SFOracleCategories,
    getFoundrySFTableByDfId
  )
}

async function walkOracleCategory(
  cat: IOracleCategory,
  tableGetter: typeof getFoundrySFTableByDfId
): Promise<OracleTreeNode> {
  const node: OracleTreeNode = {
    ...emptyNode(),
    dataforgedNode: cat,
    displayName: game.i18n.localize(`IRONSWORN.OracleCategories.${cat.Name}`),
  }

  for (const childCat of cat.Categories ?? []) {
    node.children.push(await walkOracleCategory(childCat, tableGetter))
  }
  for (const oracle of cat.Oracles ?? []) {
    node.children.push(await walkOracle(oracle, tableGetter))
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

async function walkOracle(
  oracle: IOracle,
  tableGetter: typeof getFoundrySFTableByDfId
): Promise<OracleTreeNode> {
  const table = await tableGetter(oracle.$id)

  const node: OracleTreeNode = {
    ...emptyNode(),
    dataforgedNode: oracle,
    tables: compact([table]),
    displayName:
      table?.name ||
      game.i18n.localize(`IRONSWORN.OracleCategories.${oracle.Name}`),
  }

  // Child oracles
  for (const childOracle of oracle.Oracles ?? []) {
    node.children.push(await walkOracle(childOracle, tableGetter))
  }

  // Subtables on results
  for (const entry of oracle.Table ?? []) {
    const name = entry.Result
    if (entry.Subtable) {
      const subtable = await tableGetter(`${oracle.$id}/${name}`)
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

async function augmentWithFolderContents(node: OracleTreeNode) {
  const name = game.i18n.localize('IRONSWORN.Custom Oracles')
  const rootFolder = game.tables?.directory?.folders.find(
    (x) => x.name === name
  )
  if (!rootFolder) return

  function walkFolder(parent: OracleTreeNode, folder: Folder) {
    // Add this folder
    const newNode: OracleTreeNode = {
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

function walkAndFreezeTables(node: OracleTreeNode) {
  ;(node.tables as any) = Object.freeze(node.tables)
  for (const child of node.children) {
    walkAndFreezeTables(child)
  }
}

export function findPathToNodeByTableId(
  rootNode: OracleTreeNode,
  tableId: string
): OracleTreeNode[] {
  const ret: OracleTreeNode[] = []
  function walk(node: OracleTreeNode) {
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
