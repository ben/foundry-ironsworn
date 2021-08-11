import { BaseItem } from '../baseitem'

export class BondsetItem extends BaseItem {
  static entityName = 'bondset'

  static activateActorSheetListeners(html, sheet) {
    super.activateActorSheetListeners(html, sheet)

    html.find(`.ironsworn__bondset__roll`).on('click', (e) => this._writeEpilogue.call(this, e, sheet))
  }

  static _writeEpilogue(_ev: JQuery.ClickEvent, actorSheet: ActorSheet) {
    const item = actorSheet.actor.items.find(x => x.type === 'bondset')
    item?.writeEpilogue()
  }
}
