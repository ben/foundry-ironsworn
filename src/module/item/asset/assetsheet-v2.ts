import { IronswornVueItemSheet } from '../vueitemsheet'

export class AssetSheetV2 extends IronswornVueItemSheet {
  get template() {
    return 'systems/foundry-ironsworn/templates/item/assetv2.hbs'
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
