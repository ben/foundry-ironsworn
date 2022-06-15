import { IronswornCharacterSheet } from '../../actor/sheets/charactersheet'
import { attachInlineRollListeners, RollDialog } from '../../helpers/rolldialog'
import { BaseItem } from '../baseitem'

export class AssetItem extends BaseItem {
  static entityName = 'asset'

  static activateActorSheetListeners(html: JQuery, sheet: IronswornCharacterSheet) {
    super.activateActorSheetListeners(html, sheet)

    html.find('.ironsworn__asset__expand').on('click', (e) => this._onAssetHeaderClick.call(this, e, sheet))
    html.find('.ironsworn__assettrack__value').on('click', (e) => this._onTrackValueClick.call(this, e, sheet))
    html.find('.ironsworn__assettrack__roll').on('click', (e) => this._onTrackRollClick.call(this, e, sheet))
    html.find('.ironsworn__assetoption').on('click', (e) => this._onAssetOptionClick.call(this, e, sheet))

    html.find('.ironsworn__asset').each((_i, el) => {
      attachInlineRollListeners($(el), { actor: sheet.actor })
    })
  }

  static _onAssetHeaderClick(ev: JQuery.ClickEvent, sheet: ActorSheet) {
    ev.preventDefault()

    const el = ev.currentTarget
    const itemId = el.dataset.item
    const item = sheet.actor.items.get(itemId)
    item?.setFlag('foundry-ironsworn', 'expanded', !item.getFlag('foundry-ironsworn', 'expanded'))
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
    const item = sheet.actor.items.get(itemId)
    if (item) {
      RollDialog.show({
        actor: sheet.actor,
        asset: item,
        stat: 'track',
      })
    }
  }

  static _onAssetOptionClick(ev: JQuery.ClickEvent, sheet: ActorSheet) {
    ev.preventDefault()

    const itemId = $(ev.currentTarget).parents('.item-row').data('item')
    const item = sheet.actor.items.get(itemId)
    if (item && item.data.type === 'asset') {
      const { idx } = ev.currentTarget.dataset
      const exclusiveOptions = Object.values(item.data.data.exclusiveOptions)
      for (const o of exclusiveOptions) {
        o.selected = false
      }
      exclusiveOptions[idx].selected = true
      item.update({ data: { exclusiveOptions } })
    }
  }
}
