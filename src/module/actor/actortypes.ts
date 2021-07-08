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

interface CharacterDataSource {
  type: 'character'
  data: CharacterDataSourceData
}

interface SharedDataSourceData {}

interface SharedDataSource {
  type: 'shared'
  data: SharedDataSourceData
}

export type ActorDataSource = CharacterDataSource | SharedDataSource

declare global {
  interface SourceConfig {
    Actor: ActorDataSource
  }
}
