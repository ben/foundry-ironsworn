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
import { IronswornRoll } from './module/rolls'

export interface IronswornConfig {
  itemClasses: Array<typeof BaseItem>
  actorClass: typeof IronswornActor
  importFromDatasworn: typeof importFromDatasworn
  applications: {
    createActorDialog: CreateActorDialog | null
  }

  IronswornRoll: typeof IronswornRoll

  Dataforged: typeof starforged
  dataforgedHelpers: typeof dataforgedHelpers

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

  IronswornRoll,

  importFromDatasworn,

  Dataforged: starforged,
  dataforgedHelpers,

  _: lodash,
  marked,
}
