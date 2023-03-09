import { IronswornActor } from './module/actor/actor'
import * as dataforgedHelpers from './module/dataforged'
import { importFromDatasworn } from './module/datasworn'
import { starforged } from 'dataforged'
import type { Emitter } from 'mitt'
import Mitt from 'mitt'
import {
  IronswornRoll,
  IronswornPrerollDialog,
  IronswornRollMessage,
  OracleRollMessage,
} from './module/rolls'
import { AssetCompendiumBrowser } from './module/item/asset-compendium-browser'
import { FirstStartDialog } from './module/applications/firstStartDialog'
import { SFSettingTruthsDialogVue } from './module/applications/vueSfSettingTruthsDialog'
import { WorldTruthsDialog } from './module/applications/worldTruthsDialog'
import { OracleWindow } from './module/applications/oracle-window'

export type EmitterEvents = {
  highlightMove: string // Foundry UUID
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
    // Dialogs
    FirstStartDialog: typeof FirstStartDialog
    ISSettingTruthsDialog: typeof WorldTruthsDialog
    SFSettingTruthsDialog: typeof SFSettingTruthsDialogVue
    AssetCompendiumBrowser: typeof AssetCompendiumBrowser
    OracleWindow: typeof OracleWindow

    // Rolling
    IronswornRoll: typeof IronswornRoll
    IronswornPrerollDialog: typeof IronswornPrerollDialog
    IronswornRollMessage: typeof IronswornRollMessage
    OracleRollMessage: typeof OracleRollMessage
  }

  Dataforged: typeof starforged
  dataforgedHelpers: typeof dataforgedHelpers

  emitter: IronswornEmitter
}

export const IRONSWORN: IronswornConfig = {
  actorClass: IronswornActor,

  applications: {
    FirstStartDialog,
    ISSettingTruthsDialog: WorldTruthsDialog,
    SFSettingTruthsDialog: SFSettingTruthsDialogVue,
    AssetCompendiumBrowser,
    OracleWindow,

    IronswornRoll,
    IronswornPrerollDialog,
    IronswornRollMessage,
    OracleRollMessage,
  },

  importFromDatasworn,

  Dataforged: starforged,
  dataforgedHelpers,

  emitter: Mitt<EmitterEvents>(),
}
