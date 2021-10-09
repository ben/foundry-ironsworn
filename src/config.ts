import { IronswornActor } from './module/actor/actor'
import { CreateActorDialog } from './module/applications/createActorDialog'
import { createIronswornDenizenChat } from './module/chat/chatrollhelpers'
import { RANKS, RANK_INCREMENTS } from './module/constants'
import { importFromDatasworn } from './module/datasworn'
import { defaultActor } from './module/helpers/actors'
import { moveDataByName } from './module/helpers/data'
import { attachInlineRollListeners, RollDialog } from './module/helpers/roll'
import { IronswornSettings } from './module/helpers/settings'
import { AssetItem } from './module/item/asset/assetitem'
import { BaseItem } from './module/item/baseitem'
import { BondsetItem } from './module/item/bondset/bondsetitem'
import { DelveDomainItem } from './module/item/delve-theme-domain/delvedomainitem'
import { DelveThemeItem } from './module/item/delve-theme-domain/delvethemeitem'
import { MoveItem } from './module/item/move/moveitem'
import { ProgressItem } from './module/item/progress/progressitem'
import { VowItem } from './module/item/vow/vowitem'

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
  Ranks: typeof RANKS
  RankIncrements: typeof RANK_INCREMENTS
  attachInlineRollListeners: typeof attachInlineRollListeners
  createIronswornDenizenChat: typeof createIronswornDenizenChat
  moveDataByName: typeof moveDataByName
  defaultActor: typeof defaultActor
}

export const IRONSWORN: IronswornConfig = {
  itemClasses: [AssetItem, BondsetItem, MoveItem, ProgressItem, VowItem, DelveDomainItem, DelveThemeItem],
  actorClass: IronswornActor,

  applications: {
    createActorDialog: null,
  },

  importFromDatasworn,

  IronswornSettings,
  RollDialog,
  Ranks: RANKS,
  RankIncrements: RANK_INCREMENTS,
  attachInlineRollListeners,
  createIronswornDenizenChat,
  moveDataByName,
  defaultActor,
}
