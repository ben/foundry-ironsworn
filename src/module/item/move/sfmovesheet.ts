import sfmoveSheetVue from '../../vue/sfmove-sheet.vue'
import { VueSheetRenderHelperOptions } from '../../vue/vue-render-helper'
import { VueItemSheet } from '../../vue/vueitemsheet'

export class SFMoveSheet extends VueItemSheet {
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      template: 'systems/foundry-ironsworn/templates/item/sfmove.hbs',
      height: 650,
    })
  }

  get renderHelperOptions(): Partial<VueSheetRenderHelperOptions> {
    return {
      components: { 'sfmove-sheet': sfmoveSheetVue },
    }
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
