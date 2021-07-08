import { BaseItem } from '../baseitem'

export class BondsetItem extends BaseItem {
  static entityName = 'bondset'

  static activateActorSheetListeners(html, sheet) {
    super.activateActorSheetListeners(html, sheet)
  }
}
