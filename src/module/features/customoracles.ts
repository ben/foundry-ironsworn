import { starforged, IOracle, IOracleCategory, ironsworn } from 'dataforged'
import { compact } from 'lodash'
import { getFoundryISTableByDfId, getFoundrySFTableByDfId } from '../dataforged'

export interface OracleTreeNode {
  dataforgedNode?: IOracle | IOracleCategory
  tables: RollTable[]
  displayName: string
  children: OracleTreeNode[]
}

const emptyNode = () =>
  ({
    displayName: '',
    tables: [],
    children: [],
  } as OracleTreeNode)

export async function createIronswornOracleTree(): Promise<OracleTreeNode> {
  const rootNode = emptyNode()

  // Make sure the compendium is loaded
  const pack = game.packs.get('foundry-ironsworn.ironswornoracles')
  await pack?.getDocuments()

  // Build the default tree
  for (const category of ironsworn.oracles) {
    rootNode.children.push(await walkOracleCategory(category, getFoundryISTableByDfId))
  }

  // Add in custom oracles from a well-known directory
  await augmentWithFolderContents(rootNode)

  // Fire the hook and allow extensions to modify the tree
  await Hooks.call('ironswornOracles', rootNode)

  return rootNode
}

export async function createStarforgedOracleTree(): Promise<OracleTreeNode> {
  const rootNode = emptyNode()

  // Make sure the compendium is loaded
  const pack = game.packs.get('foundry-ironsworn.starforgedoracles')
  await pack?.getDocuments()

  // Build the default tree
  for (const category of starforged.oracles) {
    rootNode.children.push(await walkOracleCategory(category, getFoundrySFTableByDfId))
  }

  // Add in custom oracles from a well-known directory
  await augmentWithFolderContents(rootNode)

  // Fire the hook and allow extensions to modify the tree
  await Hooks.call('ironswornOracles', rootNode)

  return rootNode
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

async function walkOracle(oracle: IOracle, tableGetter: typeof getFoundrySFTableByDfId): Promise<OracleTreeNode> {
  const table = await tableGetter(oracle.$id)

  const node: OracleTreeNode = {
    ...emptyNode(),
    dataforgedNode: oracle,
    tables: compact([table]),
    displayName: table?.name || game.i18n.localize(`IRONSWORN.OracleCategories.${oracle.Name}`),
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
  const rootFolder = game.tables?.directory?.folders.find((x) => x.name === name)
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
        tables: [table],
        displayName: table.name ?? '(table)',
      })
    }
  }

  walkFolder(node, rootFolder)
}

export function findPathToNodeByTableId(rootNode: OracleTreeNode, tableId: string): OracleTreeNode[] {
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
