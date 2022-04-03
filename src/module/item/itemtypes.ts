import { RANKS } from '../constants'

interface ProgressBase {
  rank: keyof typeof RANKS
  current: number
  completed: Boolean
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

interface AssetDataPropertiesData extends AssetDataSourceData {}

export interface AssetDataSource {
  type: 'asset'
  data: AssetDataSourceData
}

export interface AssetDataProperties {
  type: 'asset'
  data: AssetDataPropertiesData
}

///////////////////////////////

interface ProgressDataSourceData extends ProgressBase {
  subtype: String
  starred: Boolean
  hasTrack: Boolean
  hasClock: Boolean
  clockTicks: Number
  clockMax: Number
}
interface ProgressDataPropertiesData extends ProgressDataSourceData {}

export interface ProgressDataSource {
  type: 'progress'
  data: ProgressDataSourceData
}
export interface ProgressDataProperties {
  type: 'progress'
  data: ProgressDataPropertiesData
}

///////////////////////////////

interface VowDataSourceData extends ProgressBase {
  description: string
  threat: string
  menace: number
}
interface VowDataPropertiesData extends VowDataSourceData {}

export interface VowDataSource {
  type: 'vow'
  data: VowDataSourceData
}
export interface VowDataProperties {
  type: 'vow'
  data: VowDataPropertiesData
}

///////////////////////////////

interface Bond {
  name: string
  notes: string
}

interface BondsetDataSourceData {
  bonds: Bond[]
}
interface BondsetDataPropertiesData extends BondsetDataSourceData {}

export interface BondsetDataSource {
  type: 'bondset'
  data: BondsetDataSourceData
}
export interface BondsetDataProperties {
  type: 'bondset'
  data: BondsetDataPropertiesData
}

///////////////////////////////

export interface FeatureOrDanger {
  low: number
  high: number
  description: string
}

interface DelveThemeDataSourceData {
  summary: string
  description: string
  features: FeatureOrDanger[]
  dangers: FeatureOrDanger[]
}
interface DelveThemeDataPropertiesData extends DelveThemeDataSourceData {}

export interface DelveThemeDataSource {
  type: 'delve-theme'
  data: DelveThemeDataSourceData
}
export interface DelveThemeDataProperties {
  type: 'delve-theme'
  data: DelveThemeDataPropertiesData
}
///////////////////////////////

interface DelveDomainDataSourceData {
  summary: string
  description: string
  features: FeatureOrDanger[]
  dangers: FeatureOrDanger[]
}
interface DelveDomainDataPropertiesData extends DelveDomainDataSourceData {}

export interface DelveDomainDataSource {
  type: 'delve-domain'
  data: DelveDomainDataSourceData
}
export interface DelveDomainDataProperties {
  type: 'delve-domain'
  data: DelveDomainDataPropertiesData
}

///////////////////////////////

interface MoveDataSourceData {
  description: string
  fulltext: string
  strong: string
  strongmatch: string
  weak: string
  miss: string
  missmatch: string
  stats: string[]
  sourceId: string
}
interface MoveDataPropertiesData extends MoveDataSourceData {}

export interface MoveDataSource {
  type: 'move'
  data: MoveDataSourceData
}
export interface MoveDataProperties {
  type: 'move'
  data: MoveDataPropertiesData
}

///////////////////////////////

export type ItemDataSource = AssetDataSource | ProgressDataSource | VowDataSource | BondsetDataSource | MoveDataSource | DelveThemeDataSource | DelveDomainDataSource
export type ItemDataProperties = AssetDataProperties | ProgressDataProperties | VowDataProperties | BondsetDataProperties | MoveDataProperties | DelveThemeDataProperties | DelveDomainDataProperties

declare global {
  interface SourceConfig {
    Item: ItemDataSource
  }

  interface DataConfig {
    Item: ItemDataProperties
  }
}
