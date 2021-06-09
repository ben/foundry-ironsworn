import { BaseItem } from '../baseitem'

export class ProgressItem extends BaseItem {
  static entityName = 'progress'

  static activateActorSheetListeners(html, sheet) {
    super.activateActorSheetListeners(html, sheet)
  }
}
