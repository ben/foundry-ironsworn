import { importFromDatasworn } from './module/datasworn'
import { AssetItem } from './module/item/asset/assetitem'
import { BaseItem } from './module/item/baseitem'
import { BondItem } from './module/item/bond/bonditem'
import { BondsetItem } from './module/item/bondset/bondsetitem'
import { MoveItem } from './module/item/move/moveitem'
import { ProgressItem } from './module/item/progress/progressitem'
import { VowItem } from './module/item/vow/vowitem'

export interface IronswornConfig {
  itemClasses: Array<typeof BaseItem>
  importFromDatasworn: typeof importFromDatasworn
}

export const IRONSWORN: IronswornConfig = {
  itemClasses: [AssetItem, BondItem, BondsetItem, MoveItem, ProgressItem, VowItem],

  importFromDatasworn,
}
