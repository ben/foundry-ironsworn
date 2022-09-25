import { IMove, IOracle, IOracleCategory } from 'dataforged'
import { IronswornItem } from '../item/item'
import { cachedDocumentsForPack } from '../features/pack-cache'
import {
  SFMoveCategories,
  SFOracleCategories,
  ISOracleCategories,
} from './data'
import { hashLookup } from './import'

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
  const sfDocuments =
    (await cachedDocumentsForPack('foundry-ironsworn.starforgedmoves')) ?? []
  const isDocuments =
    (await cachedDocumentsForPack('foundry-ironsworn.ironswornmoves')) ?? []
  return [...sfDocuments, ...isDocuments]?.find(
    (x) => x.id === hashLookup(dfid)
  ) as IronswornItem | undefined
}

export async function getDFMoveByDfId(
  dfid: string
): Promise<IMove | undefined> {
  for (const category of SFMoveCategories) {
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

  for (const cat of [...SFOracleCategories, ...ISOracleCategories]) {
    walkCategory(cat)
  }
  return ret
}
