import { IronswornActor } from './module/actor/actor'
import { CreateActorDialog } from './module/applications/createActorDialog'
import * as dataforgedHelpers from './module/dataforged'
import { importFromDatasworn } from './module/datasworn'
import { starforged } from 'dataforged'
import {
  IronswornRoll,
  IronswornPrerollDialog,
  IronswornRollMessage,
  OracleRollMessage,
} from './module/rolls'
import { AssetCompendiumBrowser } from './module/item/asset-compendium-browser'
import Mitt, { Emitter } from 'mitt'

export type EmitterEvents = {
  closeApp: void
  highlightMove: string // Foundry ID
  highlightOracle: string // DF ID
}
export type IronswornEmitter = Emitter<EmitterEvents>

export interface IronswornConfig {
  actorClass: typeof IronswornActor
  importFromDatasworn: typeof importFromDatasworn
  applications: {
    createActorDialog: CreateActorDialog | null
  }

  IronswornRoll: typeof IronswornRoll
  IronswornPrerollDialog: typeof IronswornPrerollDialog
  IronswornRollMessage: typeof IronswornRollMessage
  OracleRollMessage: typeof OracleRollMessage

  Dataforged: typeof starforged
  dataforgedHelpers: typeof dataforgedHelpers

  emitter: IronswornEmitter

  beta: { [k: string]: any }
}

export const IRONSWORN: IronswornConfig = {
  actorClass: IronswornActor,

  applications: {
    createActorDialog: null,
  },

  IronswornRoll,
  IronswornPrerollDialog,
  IronswornRollMessage,
  OracleRollMessage,

  importFromDatasworn,

  Dataforged: starforged,
  dataforgedHelpers,

  emitter: Mitt<EmitterEvents>(),

  beta: {
    AssetCompendiumBrowser,
  },
}
