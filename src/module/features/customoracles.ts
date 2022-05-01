import { IOracle, IOracleCategory } from 'dataforged'
import { starforged } from 'dataforged'
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

export async function createOracleTree(): Promise<OracleTreeNode> {
  // TODO: are we doing Ironsworn or Starforged? SF only for now

  const rootNode = emptyNode()

  // Make sure the compendium is loaded
  const pack = game.packs.get('foundry-ironsworn.starforgedoracles')
  await pack?.getDocuments()

  // Build the default tree
  for (const category of starforged.oracles) {
    rootNode.children.push(await walkOracleCategory(category))
  }

  // TODO: Add in custom oracles from a well-known directory

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
