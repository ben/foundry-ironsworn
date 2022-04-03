import { IronswornVueItemSheet } from '../vueitemsheet'

export class MoveSheetV2 extends IronswornVueItemSheet {
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      template: 'systems/foundry-ironsworn/templates/item/movev2.hbs',
      height: 650,
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
