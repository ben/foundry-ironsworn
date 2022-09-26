import { starforged, Starforged, ironsworn, Ironsworn } from 'dataforged'

// For some reason, rollupJs mangles this
export const SFMoveCategories = ((starforged as any).default as Starforged)[
  'Move Categories'
]
export const ISMoveCategories = ((ironsworn as any).default as Ironsworn)[
  'Move Categories'
]
export const SFOracleCategories = ((starforged as any).default as Starforged)[
  'Oracle Categories'
]
export const ISOracleCategories = ((ironsworn as any).default as Ironsworn)[
  'Oracle Categories'
]
export const SFAssetTypes = ((starforged as any).default as Starforged)[
  'Asset Types'
]
export const ISAssetTypes = ((ironsworn as any).default as Ironsworn)[
  'Asset Types'
]
