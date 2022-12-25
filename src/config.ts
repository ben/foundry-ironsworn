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
import { OracleWindow } from './module/applications/oracle-window'

export type EmitterEvents = {
  highlightMove: string // Foundry ID
  highlightOracle: string // DF ID
  globalConditionChanged: { name: string; enabled: boolean } // info about condition that changed
  dragStart: string // type of item
  dragEnd: string // type of item
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

  OracleWindow: typeof OracleWindow

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

  OracleWindow,

  beta: {
    AssetCompendiumBrowser,
  },
}
