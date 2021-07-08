import { BaseItem } from '../baseitem'

export class MoveItem extends BaseItem {
  static entityName = 'move'

  static activateActorSheetListeners(html, sheet) {
    super.activateActorSheetListeners(html, sheet)
  }
}
