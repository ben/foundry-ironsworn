import { IronswornItemSheet } from '../item-sheet'

export class ProgressSheet extends IronswornItemSheet {
  get template() {
    return 'systems/foundry-ironsworn/templates/item/progress.hbs'
  }

  activateListeners(html: JQuery) {
    super.activateListeners(html)

    html.find('.ironsworn__progress__mark').on('click', () => this.item.markProgress())
    html.find('.ironsworn__progress__fulfill').on('click', () => this.item.fulfill())
    html.find('.ironsworn__progress__clear').on('click', () => this.item.clearProgress())
    html.find('.ironsworn__progress__rank').on('click', (e) => this._handleRankSet.call(this, e))
    html.find('.ironsworn__progress__delete').on('click', (e) => this._handleDelete.call(this, e))
  }

  _handleRankSet(ev: JQuery.ClickEvent) {
    ev.preventDefault()
    this.item.update({ 'data.rank': ev.currentTarget.dataset.rank })
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
