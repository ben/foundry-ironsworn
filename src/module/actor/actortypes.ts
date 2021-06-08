import { IronswornItemData } from "../item/itemtypes";

interface CharacterData {
    biography: string,
    edge: number,
    heart: number,
    iron: number,
    shadow: number,
    wits: number,
    health: number,
    spirit: number,
    supply: number,
    experience: number,
    momentum: number,
    debility: {
      corrupted: boolean,
      cursed: boolean,
      encumbered: boolean,
      maimed: boolean,
      shaken: boolean,
      tormented: boolean,
      unprepared: boolean,
      wounded: boolean
    },
    xp: number
}

interface CharacterActorData extends Actor.Data<CharacterData, IronswornItemData> {
    type: "character";
}

interface SharedData {
    
}

interface SharedActorData extends Actor.Data<SharedData, IronswornItemData> {
    type: "character";
}

export type IronswornActorData = CharacterActorData | SharedActorData