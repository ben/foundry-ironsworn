import { IronswornItemSheet } from '../item-sheet'
import { AssetItemData } from '../itemtypes'

export class AssetSheet extends IronswornItemSheet {
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      height: 600,
    } as BaseEntitySheet.Options)
  }

  activateListeners(html: JQuery) {
    html.find('.ironsworn__ability__enable').on('click', (ev) => this._abilityToggle.call(this, ev))
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

  _abilityToggle(ev: JQuery.ClickEvent) {
    ev.preventDefault()

    const { idx } = ev.currentTarget.dataset
    const assetData = this.item.data as AssetItemData
    const abilities = Object.values(assetData.data.abilities)
    abilities[idx].enabled = !abilities[idx].enabled
    this.item.update({ data: { abilities } })
  }
}
