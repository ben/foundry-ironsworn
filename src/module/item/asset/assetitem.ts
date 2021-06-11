import { IronswornRollDialog } from '../../helpers/roll'
import { BaseItem } from '../baseitem'
import { AssetItemData } from '../itemtypes'

export class AssetItem extends BaseItem {
  static entityName = 'asset'

  static activateActorSheetListeners(html, sheet) {
    super.activateActorSheetListeners(html, sheet)

    // TODO: rollables, tracks, etc.
    html.find(`.ironsworn__assettrack__value`).click((e) => this._onTrackValueClick.call(this, e, sheet))
    html.find(`.ironsworn__assettrack__roll`).click((e) => this._onTrackRollClick.call(this, e, sheet))
  }

  static _onTrackValueClick(ev: JQuery.ClickEvent, sheet: ActorSheet) {
    ev.preventDefault()

    const itemId = $(ev.currentTarget).parents('.item-row').data('item')
    const { value } = ev.currentTarget.dataset
    const item = sheet.actor.items.get(itemId)
    item?.update({ 'data.track.current': parseInt(value) })
  }

  static _onTrackRollClick(ev: JQuery.ClickEvent, sheet: ActorSheet) {
    ev.preventDefault()

    const itemId = $(ev.currentTarget).parents('.item-row').data('item')
    const item = sheet.actor.items.get(itemId) as Item<AssetItemData>
    if (item) {
      const data = {
        ...sheet.actor.getRollData(),
        track: item.data.data.track.current
      }
      IronswornRollDialog.showDialog(data, 'track', item.name)
    }
  }
}
