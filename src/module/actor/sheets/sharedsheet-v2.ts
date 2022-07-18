import sharedSheetVue from '../../vue/shared-sheet.vue'
import { VueSheetRenderHelperOptions } from '../../vue/vue-render-helper'
import { VueActorSheet } from '../../vue/vueactorsheet'

export class IronswornSharedSheetV2 extends VueActorSheet {
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      template: 'systems/foundry-ironsworn/templates/actor/shared-v2.hbs',
      width: 350,
      height: 700,
    })
  }

  get renderHelperOptions(): Partial<VueSheetRenderHelperOptions> {
    return {
      components: { 'shared-sheet': sharedSheetVue },
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
    const currentValue = this.actor.getFlag('foundry-ironsworn', 'edit-mode')
    this.actor.setFlag('foundry-ironsworn', 'edit-mode', !currentValue)
  }
}
