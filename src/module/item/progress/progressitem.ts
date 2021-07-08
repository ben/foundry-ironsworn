import { BaseItem } from '../baseitem'

export class ProgressItem extends BaseItem {
  static entityName = 'progress'

  static activateActorSheetListeners(html: JQuery, sheet) {
    super.activateActorSheetListeners(html, sheet)

    html.find(`.ironsworn__progress__mark`).on('click', (e) => this._handleMarkProgress.call(this, e, sheet))
    html.find(`.ironsworn__progress__fulfill`).on('click', (e) => this._handleFulfill.call(this, e, sheet))
    html.find(`.ironsworn__progress__rank`).on('click', (e) => this._handleRankSet.call(this, e, sheet))
  }

  static _handleMarkProgress(ev, actorSheet) {
    ev.preventDefault()

    const itemId = ev.currentTarget.dataset.item
    const item = actorSheet.actor.items.get(itemId)
    item.markProgress()
  }

  static _handleFulfill(ev, actorSheet) {
    ev.preventDefault()

    const itemId = ev.currentTarget.dataset.item
    const item = actorSheet.actor.items.get(itemId)
    item.fulfill()
  }

  static _handleRankSet(ev, actorSheet) {
    ev.preventDefault()

    const { item: itemId, rank } = ev.currentTarget.dataset
    const item = actorSheet.actor.items.get(itemId)
    item.update({ data: { rank } })
  }
}
