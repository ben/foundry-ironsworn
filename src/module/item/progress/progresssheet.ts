import { IronswornItemSheet } from '../item-sheet'

export class ProgressSheet extends IronswornItemSheet {
  get template() {
    return 'systems/foundry-ironsworn/templates/item/progress.hbs'
  }

  activateListeners(html: JQuery) {
    super.activateListeners(html)

    html.find(`.ironsworn__progress__mark`).on('click', (e) => this._handleMarkProgress.call(this, e))
    html.find(`.ironsworn__progress__fulfill`).on('click', (e) => this._handleFulfill.call(this, e))
    html.find(`.ironsworn__progress__rank`).on('click', e => this._handleRankSet.call(this, e))
  }

  _handleMarkProgress(ev: JQuery.ClickEvent) {
    ev.preventDefault()
  }
  _handleFulfill(ev: JQuery.ClickEvent) {
    ev.preventDefault()
  }
  _handleRankSet(ev: JQuery.ClickEvent) {
    ev.preventDefault()

    this.item.update({'data.rank': ev.currentTarget.dataset.rank})
  }
}
