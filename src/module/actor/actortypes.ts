import { IronswornItemData } from '../item/itemtypes'

export interface IronswornCharacterData {
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

interface CharacterActorData extends Actor.Data<IronswornCharacterData, IronswornItemData> {
  type: 'character'
}

interface SharedData {}

interface SharedActorData extends Actor.Data<SharedData, IronswornItemData> {
  type: 'shared'
}

export type IronswornActorData = CharacterActorData | SharedActorData
