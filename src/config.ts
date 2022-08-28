import * as lodash from 'lodash'
import { marked } from 'marked'
import { IronswornActor } from './module/actor/actor'
import { CreateActorDialog } from './module/applications/createActorDialog'
import * as dataforgedHelpers from './module/dataforged'
import { importFromDatasworn } from './module/datasworn'
import { AssetItem } from './module/item/asset/assetitem'
import { BaseItem } from './module/item/baseitem'
import { BondsetItem } from './module/item/bondset/bondsetitem'
import { DelveDomainItem } from './module/item/delve-theme-domain/delvedomainitem'
import { DelveThemeItem } from './module/item/delve-theme-domain/delvethemeitem'
import { MoveItem } from './module/item/move/moveitem'
import { ProgressItem } from './module/item/progress/progressitem'
import { VowItem } from './module/item/vow/vowitem'
import { starforged } from 'dataforged'
import {
  IronswornRoll,
  IronswornPrerollDialog,
  IronswornRollMessage,
  OracleRollMessage,
} from './module/rolls'

export interface IronswornConfig {
  itemClasses: Array<typeof BaseItem>
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
  IronswornPrerollDialog,
  IronswornRollMessage,
  OracleRollMessage,

  importFromDatasworn,

  Dataforged: starforged,
  dataforgedHelpers,

  _: lodash,
  marked,
}
