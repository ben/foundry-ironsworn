import { BaseItem } from "./module/item/baseitem";
import { VowItem } from "./module/item/vow/vowitem";

export interface IronswornConfig {
  itemClasses: Array<typeof BaseItem>
}

export const IRONSWORN: IronswornConfig = {
  itemClasses: [
    VowItem
  ]
}
