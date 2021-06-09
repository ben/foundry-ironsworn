import { BaseItem } from '../baseitem'

export class AssetItem extends BaseItem {
  static entityName = 'asset'

  static activateActorSheetListeners(html, sheet) {
    super.activateActorSheetListeners(html, sheet)

    // TODO: rollables, tracks, etc.
  }
}
