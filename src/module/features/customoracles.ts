import { starforged, IOracle, IOracleCategory } from 'dataforged'
import { getFoundryTableByDfId } from '../dataforged'

export interface OracleTreeNode {
  dataforgedNode?: IOracle | IOracleCategory
  table?: RollTable
  displayName: string
  children: OracleTreeNode[]
}

const emptyNode = () =>
  ({
    displayName: '',
    children: [],
  } as OracleTreeNode)

export async function createStarforgedOracleTree(): Promise<OracleTreeNode> {
  const rootNode = emptyNode()

  // Make sure the compendium is loaded
  const pack = game.packs.get('foundry-ironsworn.starforgedoracles')
  await pack?.getDocuments()

  // Build the default tree
  for (const category of starforged.oracles) {
    rootNode.children.push(await walkOracleCategory(category))
  }

  // TODO: Add in custom oracles from a well-known directory
  await augmentWithFolderContents(rootNode)

  // Fire the hook and allow extensions to modify the tree
  Hooks.call('ironswornOracles', rootNode)

  return rootNode
}

async function walkOracleCategory(cat: IOracleCategory): Promise<OracleTreeNode> {
  const node: OracleTreeNode = {
    ...emptyNode(),
    dataforgedNode: cat,
    displayName: game.i18n.localize(`IRONSWORN.SFOracleCategories.${cat.Display.Title}`),
  }

  for (const childCat of cat.Categories ?? []) node.children.push(await walkOracleCategory(childCat))
  for (const oracle of cat.Oracles ?? []) node.children.push(await walkOracle(oracle))

  return node
}

async function walkOracle(oracle: IOracle): Promise<OracleTreeNode> {
  const table = await getFoundryTableByDfId(oracle.$id)

  const node: OracleTreeNode = {
    ...emptyNode(),
    dataforgedNode: oracle,
    table,
    displayName: table?.name || game.i18n.localize(`IRONSWORN.SFOracleCategories.${oracle.Display.Title}`),
  }

  for (const childOracle of oracle.Oracles ?? []) node.children.push(await walkOracle(childOracle))

  return node
}

async function augmentWithFolderContents(node:OracleTreeNode) {
  const name = game.i18n.localize('IRONSWORN.Custom Oracles')
  const folder = game.tables?.directory?.folders.find(x => x.name === name)
  if (!folder) return

  function walkFolder(parent:OracleTreeNode, folder: Folder) {
    // Add this folder
    const newNode:OracleTreeNode = {
      ...emptyNode(),
      displayName: folder.name
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
        table,
        displayName: table.name ?? '(table)',
      })
    }
  }

  walkFolder(node, folder)
}

export function findPathToNodeByTableId(rootNode: OracleTreeNode, tableId: string): OracleTreeNode[] {
  const ret: OracleTreeNode[] = []
  function walk(node:OracleTreeNode) {
    ret.push(node)
    if (node.table?.id === tableId) return true
    for (const child of node.children) {
      if (walk(child)) return true
    }
    ret.pop()
    return false
  }

  walk(rootNode)
  return ret
}
