import { CreateActorDialog } from './module/applications/createActorDialog'
import { importFromDatasworn } from './module/datasworn'
import { AssetItem } from './module/item/asset/assetitem'
import { BaseItem } from './module/item/baseitem'
import { BondsetItem } from './module/item/bondset/bondsetitem'
import { MoveItem } from './module/item/move/moveitem'
import { ProgressItem } from './module/item/progress/progressitem'
import { VowItem } from './module/item/vow/vowitem'

export interface IronswornConfig {
  itemClasses: Array<typeof BaseItem>
  importFromDatasworn: typeof importFromDatasworn
  applications: {
    createActorDialog: CreateActorDialog | null
  }
}

export const IRONSWORN: IronswornConfig = {
  itemClasses: [AssetItem, BondsetItem, MoveItem, ProgressItem, VowItem],

  applications: {
    createActorDialog: null,
  },

  importFromDatasworn,
}
