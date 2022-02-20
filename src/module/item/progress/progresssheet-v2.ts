import { IronswornVueItemSheet } from '../vueitemsheet'

export class ProgressSheetV2 extends IronswornVueItemSheet {
  get template() {
    return 'systems/foundry-ironsworn/templates/item/progressv2.hbs'
  }

  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      height: 550,
    })
  }

  _getHeaderButtons() {
    return [
      {
        class: 'ironsworn-toggle-edit-mode',
        label: 'Edit',
        icon: 'fas fa-edit',
        onclick: (e) => this._toggleEditMode(e),
      },
      ...super._getHeaderButtons(),
    ]
  }

  _toggleEditMode(_e: JQuery.ClickEvent) {
    const currentValue = this.item.getFlag('foundry-ironsworn', 'edit-mode')
    this.item.setFlag('foundry-ironsworn', 'edit-mode', !currentValue)
  }
}
