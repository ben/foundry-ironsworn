interface CharacterDataSourceData {
  biography: string
  edge: number
  heart: number
  iron: number
  shadow: number
  wits: number
  health: number
  spirit: number
  supply: number
  experience: number
  momentum: number
  momentumMax: number
  momentumReset: number
  debility: {
    corrupted: boolean
    cursed: boolean
    encumbered: boolean
    maimed: boolean
    shaken: boolean
    tormented: boolean
    unprepared: boolean
    wounded: boolean
  }
  xp: number
}

interface CharacterDataPropertiesData extends CharacterDataSourceData {
  momentumMax: number
  momentumReset: number
}

interface CharacterDataProperties {
  type: 'character'
  data: CharacterDataPropertiesData
}

interface CharacterDataSource {
  type: 'character'
  data: CharacterDataSourceData
}

interface SharedDataSourceData {}
interface SharedDataPropertiesData {}

interface SharedDataSource {
  type: 'shared'
  data: SharedDataSourceData
}
interface SharedDataProperties {
  type: 'shared'
  data: SharedDataPropertiesData
}

export type ActorDataSource = CharacterDataSource | SharedDataSource
export type ActorDataProperties = CharacterDataProperties | SharedDataProperties

declare global {
  interface SourceConfig {
    Actor: ActorDataSource
  }

  interface DataConfig {
    Actor: ActorDataProperties
  }
}
