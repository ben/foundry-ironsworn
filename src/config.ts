import { BaseItem } from "./module/item/baseitem";
import { ProgressItem } from "./module/item/progress/progressitem"
import { VowItem } from "./module/item/vow/vowitem";

export interface IronswornConfig {
  itemClasses: Array<typeof BaseItem>
}

export const IRONSWORN: IronswornConfig = {
  itemClasses: [
    ProgressItem,
    VowItem
  ]
}
