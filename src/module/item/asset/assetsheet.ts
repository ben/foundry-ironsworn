import { attachInlineRollListeners } from '../../helpers/rolldialog'
import { IronswornItemSheet } from '../item-sheet'
import { AssetDataSource } from '../itemtypes'

export class AssetSheet extends IronswornItemSheet {
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      height: 650,
    })
  }

  activateListeners(html: JQuery) {
    if (!this.options.editable) return

    html.find('.ironsworn__ability__enable').on('click', (ev) => this._abilityToggle.call(this, ev))
    html.find('.ironsworn__option__enable').on('click', (ev) => this._optionToggle.call(this, ev))
    html.find('.ironsworn__option__name').on('blur', (ev) => this._updateOptionName.call(this, ev))
    html.find('.ironsworn__option__delete').on('click', (ev) => this._optionDelete.call(this, ev))
    html.find('.ironsworn__option__add').on('click', (ev) => this._optionAdd.call(this, ev))
    html.find('.ironsworn__field__add').on('click', (ev) => this._addField.call(this, ev))
    html.find('.ironsworn__field__label').on('blur', (ev) => this._updateFieldLabel.call(this, ev))
    html.find('.ironsworn__field__value').on('blur', (ev) => this._updateFieldValue.call(this, ev))
    html.find('.ironsworn__field__delete').on('click', (ev) => this._deleteField.call(this, ev))
    html.find('.ironsworn__asset__delete').on('click', (ev) => this.assetDelete.call(this, ev))

    attachInlineRollListeners(html, { actor: this.actor || undefined })
  }

  get assetData(): AssetDataSource {
    return this.item.data as AssetDataSource
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
    const abilities = Object.values(this.assetData.data.abilities)
    abilities[idx] = { ...abilities[idx], enabled: !abilities[idx].enabled }
    this.item.update({ data: { abilities } })
  }

  _optionToggle(ev: JQuery.ClickEvent) {
    ev.preventDefault()

    const { idx } = ev.currentTarget.dataset
    const exclusiveOptions = Object.values(this.assetData.data.exclusiveOptions)
    for (let i = 0; i < exclusiveOptions.length; i++) {
      exclusiveOptions[i] = { ...exclusiveOptions[i], selected: false }
    }
    exclusiveOptions[idx].selected = true
    this.item.update({ data: { exclusiveOptions } })
  }

  _updateOptionName(ev: JQuery.BlurEvent) {
    const exclusiveOptions = Object.values(this.assetData.data.exclusiveOptions)
    const { idx } = ev.currentTarget.dataset
    const val = $(ev.currentTarget).val()?.toString() || ''
    exclusiveOptions[idx].name = val
    this.item.update({ data: { exclusiveOptions } })
  }

  _optionAdd(ev: JQuery.ClickEvent) {
    ev.preventDefault()

    const exclusiveOptions = Object.values(this.assetData.data.exclusiveOptions || [])
    exclusiveOptions.push({ name: '', selected: false })
    this.item.update({ data: { exclusiveOptions } })
  }

  _optionDelete(ev: JQuery.ClickEvent) {
    ev.preventDefault()

    const { idx } = ev.currentTarget.dataset
    const exclusiveOptions = Object.values(this.assetData.data.exclusiveOptions || [])
    exclusiveOptions.splice(idx, 1)
    this.item.update({ data: { exclusiveOptions } })
  }

  _addField(ev: JQuery.ClickEvent) {
    ev.preventDefault()

    const fields = Object.values(this.assetData.data.fields || [])
    fields.push({ name: '', value: '' })
    this.item.update({ data: { fields } })
  }

  _deleteField(ev: JQuery.ClickEvent) {
    ev.preventDefault()

    const { idx } = ev.currentTarget.dataset
    const fields = Object.values(this.assetData.data.fields || [])
    fields.splice(idx, 1)
    this.item.update({ data: { fields } })
  }

  _updateFieldLabel(ev: JQuery.BlurEvent) {
    const fields = Object.values(this.assetData.data.fields)
    const { idx } = ev.currentTarget.dataset
    const val = $(ev.currentTarget).val()?.toString() || ''
    fields[idx].name = val
    this.item.update({ data: { fields } })
  }

  _updateFieldValue(ev: JQuery.BlurEvent) {
    const fields = Object.values(this.assetData.data.fields)
    const { idx } = ev.currentTarget.dataset
    const val = $(ev.currentTarget).val()?.toString() || ''
    fields[idx] = { ...fields[idx], value: val }
    this.item.update({ data: { fields } })
  }

  assetDelete(ev: JQuery.ClickEvent) {
    ev.preventDefault()

    Dialog.confirm({
      title: game.i18n.localize(`IRONSWORN.DeleteAsset`),
      content: `<p><strong>${game.i18n.localize('IRONSWORN.ConfirmDelete')}</strong></p>`,
      yes: () => this.item.delete(),
      defaultYes: false,
    })
  }
}
