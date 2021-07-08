import { RANKS } from '../constants'

interface ProgressBase {
  rank: keyof typeof RANKS
  current: number
}

///////////////////////////////

interface AssetField {
  name: string
  value: string
}

interface AssetAbility {
  name?: string
  enabled: boolean
  description: string
}

interface AssetExclusiveOption {
  name: string
  selected: boolean
}

interface AssetDataSourceData {
  fields: AssetField[]
  abilities: AssetAbility[]
  track: {
    enabled: boolean
    name: string
    current: number
    max: number
  }
  exclusiveOptions: AssetExclusiveOption[]
}

export interface AssetDataSource {
  type: 'asset'
  data: AssetDataSourceData
}

///////////////////////////////

type ProgressDataSourceData = ProgressBase

export interface ProgressDataSource {
  type: 'progress'
  data: ProgressDataSourceData
}

///////////////////////////////

interface VowDataSourceData extends ProgressBase {
  description: string
  threat: string
  menace: number
}

export interface VowDataSource {
  type: 'vow'
  data: VowDataSourceData
}

///////////////////////////////

interface Bond {
  name: string
  notes: string
}

interface BondsetDataSourceData {
  bonds: Bond[]
}

export interface BondsetDataSource {
  type: 'bondset'
  data: BondsetDataSourceData
}

///////////////////////////////

interface SiteDataSourceData extends ProgressBase {
  objective: string
  theme: string
  domain: string
  notes: string
}

export interface SiteDataSource {
  type: 'site'
  data: SiteDataSourceData
}

///////////////////////////////

interface MoveDataSourceData {
  description: string
  strong: string
  weak: string
  miss: string
  stats: string[]
}

export interface MoveDataSource {
  type: 'move'
  data: MoveDataSourceData
}

///////////////////////////////

export type ItemDataSource = AssetDataSource | ProgressDataSource | VowDataSource | BondsetDataSource | SiteDataSource | MoveDataSource

declare global {
  interface SourceConfig {
    Item: ItemDataSource
  }
}
