import * as lodash from 'lodash'
import { marked } from 'marked'
import { IronswornActor } from './module/actor/actor'
import { CreateActorDialog } from './module/applications/createActorDialog'
import {
  createIronswornChatRoll,
  createIronswornDenizenChat,
  rollAndDisplayOracleResult,
} from './module/chat/chatrollhelpers'
import { RANKS, RANK_INCREMENTS } from './module/constants'
import * as dataforgedHelpers from './module/dataforged'
import { importFromDatasworn } from './module/datasworn'
import { defaultActor } from './module/helpers/actors'
import { moveDataByName } from './module/helpers/data'
import {
  attachInlineRollListeners,
  RollDialog,
  rollSiteFeature,
} from './module/helpers/rolldialog'
import { SFRollMoveDialog } from './module/helpers/rolldialog-sf'
import { IronswornSettings } from './module/helpers/settings'
import { AssetItem } from './module/item/asset/assetitem'
import { BaseItem } from './module/item/baseitem'
import { BondsetItem } from './module/item/bondset/bondsetitem'
import { DelveDomainItem } from './module/item/delve-theme-domain/delvedomainitem'
import { DelveThemeItem } from './module/item/delve-theme-domain/delvethemeitem'
import { MoveItem } from './module/item/move/moveitem'
import { ProgressItem } from './module/item/progress/progressitem'
import { VowItem } from './module/item/vow/vowitem'
import { starforged } from 'dataforged'
import { SFCharacterMoveSheet } from './module/actor/sheets/sf-charactermovesheet'
import { SFSettingTruthsDialogVue } from './module/applications/vueSfSettingTruthsDialog'

export interface IronswornConfig {
  itemClasses: Array<typeof BaseItem>
  actorClass: typeof IronswornActor
  importFromDatasworn: typeof importFromDatasworn
  applications: {
    createActorDialog: CreateActorDialog | null
  }

  // These are for Vue
  IronswornSettings: typeof IronswornSettings
  RollDialog: typeof RollDialog
  SFRollMoveDialog: typeof SFRollMoveDialog
  Ranks: typeof RANKS
  RankIncrements: typeof RANK_INCREMENTS
  attachInlineRollListeners: typeof attachInlineRollListeners
  createIronswornChatRoll: typeof createIronswornChatRoll
  createIronswornDenizenChat: typeof createIronswornDenizenChat
  rollSiteFeature: typeof rollSiteFeature
  moveDataByName: typeof moveDataByName
  defaultActor: typeof defaultActor
  rollAndDisplayOracleResult: typeof rollAndDisplayOracleResult

  Dataforged: typeof starforged
  dataforgedHelpers: typeof dataforgedHelpers

  SFSettingTruthsDialogVue: typeof SFSettingTruthsDialogVue

  _: typeof lodash
  marked: typeof marked
}

export const IRONSWORN: IronswornConfig = {
  itemClasses: [
    AssetItem,
    BondsetItem,
    MoveItem,
    ProgressItem,
    VowItem,
    DelveDomainItem,
    DelveThemeItem,
  ],
  actorClass: IronswornActor,

  applications: {
    createActorDialog: null,
  },

  importFromDatasworn,

  IronswornSettings,
  RollDialog,
  SFRollMoveDialog,
  Ranks: RANKS,
  RankIncrements: RANK_INCREMENTS,
  attachInlineRollListeners,
  createIronswornChatRoll,
  createIronswornDenizenChat,
  rollSiteFeature,
  moveDataByName,
  defaultActor,
  rollAndDisplayOracleResult,

  SFSettingTruthsDialogVue,

  Dataforged: starforged,
  dataforgedHelpers,

  _: lodash,
  marked,
}
