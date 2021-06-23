import { IronswornItemSheet } from '../item-sheet'
import { AssetItemData } from '../itemtypes'

export class AssetSheet extends IronswornItemSheet {
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      height: 600,
    } as BaseEntitySheet.Options)
  }

  activateListeners(html: JQuery) {
    if (!this.options.editable) return

    html.find('.ironsworn__ability__enable').on('click', (ev) => this._abilityToggle.call(this, ev))
    html.find('.ironsworn__field__add').on('click', (ev) => this._addField.call(this, ev))
    html.find('.ironsworn__field__label').on('blur', (ev) => this._updateFieldLabel.call(this, ev))
    html.find('.ironsworn__field__value').on('blur', (ev) => this._updateFieldValue.call(this, ev))
    html.find('.ironsworn__field__delete').on('click', (ev) => this._deleteField.call(this, ev))
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

  _addField(ev: JQuery.ClickEvent) {
    ev.preventDefault()

    const assetData = this.item.data as AssetItemData
    const fields = Object.values(assetData.data.fields || [])
    fields.push({ name: '', value: '' })
    this.item.update({ data: { fields } })
  }

  _deleteField(ev: JQuery.ClickEvent) {
    ev.preventDefault()

    const { idx } = ev.currentTarget.dataset
    const assetData = this.item.data as AssetItemData
    const fields = Object.values(assetData.data.fields || [])
    fields.splice(idx, 1)
    this.item.update({ data: { fields } })
  }

  _updateFieldLabel(ev: JQuery.BlurEvent) {
    const assetData = this.item.data as AssetItemData
    const fields = Object.values(assetData.data.fields)
    const { idx } = ev.currentTarget.dataset
    const val = $(ev.currentTarget).val()?.toString() || ''
    fields[idx].name = val
    this.item.update({ data: { fields } })
  }
  
  _updateFieldValue(ev: JQuery.BlurEvent) {
    const assetData = this.item.data as AssetItemData
    const fields = Object.values(assetData.data.fields)
    const { idx } = ev.currentTarget.dataset
    const val = $(ev.currentTarget).val()?.toString() || ''
    fields[idx].value = val
    this.item.update({ data: { fields } })
  }
}
