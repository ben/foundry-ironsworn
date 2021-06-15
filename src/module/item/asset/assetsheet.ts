import { IronswornItemSheet } from '../item-sheet'

export class AssetSheet extends IronswornItemSheet {
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      height: 600,
    } as BaseEntitySheet.Options)
  }

  _getHeaderButtons() {
    const ret = super._getHeaderButtons()
    if (this.options.editable) {
      ret.unshift({
        class: 'ironsworn-toggle-edit-mode',
        label: 'Edit',
        icon: 'fas fa-edit',
        onclick: (e) => this._toggleEditMode(e),
      })
    }
    return ret
  }

  _toggleEditMode(e: JQuery.ClickEvent) {
    e.preventDefault()

    const currentValue = this.item.getFlag('foundry-ironsworn', 'edit-mode')
    this.item.setFlag('foundry-ironsworn', 'edit-mode', !currentValue)
  }
}
