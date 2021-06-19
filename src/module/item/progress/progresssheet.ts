import { IronswornItemSheet } from '../item-sheet'

export class ProgressSheet extends IronswornItemSheet {
  get template() {
    return 'systems/foundry-ironsworn/templates/item/progress.hbs'
  }

  activateListeners(html: JQuery) {
    super.activateListeners(html)

    html.find('.ironsworn__progress__mark').on('click', (e) => this._handleMarkProgress.call(this, e))
    html.find('.ironsworn__progress__fulfill').on('click', (e) => this._handleFulfill.call(this, e))
    html.find('.ironsworn__progress__clear').on('click', (e) => this._handleClearProgress.call(this, e))
    html.find('.ironsworn__progress__rank').on('click', e => this._handleRankSet.call(this, e))
    html.find('.ironsworn__progress__delete').on('click', e => this._handleDelete.call(this, e))
  }

  _handleMarkProgress(ev: JQuery.ClickEvent) {
    ev.preventDefault()
    this.item.markProgress()
  }

  _handleFulfill(ev: JQuery.ClickEvent) {
    ev.preventDefault()
    this.item.fulfill()
  }

  _handleClearProgress(ev: JQuery.ClickEvent) {
    ev.preventDefault()
    this.item.clearProgress()
  }

  _handleRankSet(ev: JQuery.ClickEvent) {
    ev.preventDefault()
    this.item.update({'data.rank': ev.currentTarget.dataset.rank})
  }

  _handleDelete(ev: JQuery.ClickEvent) {
    ev.preventDefault()
    Dialog.confirm({
      title: game.i18n.localize('IRONSWORN.DeleteItem'),
      content: `<p>${game.i18n.localize('IRONSWORN.ConfirmDelete')}</p>`,
      yes: () => this.item.delete(),
      defaultYes: false,
    })
  }
}
