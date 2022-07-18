import foeSheetVue from '../../vue/components/foe-sheet.vue'
import { VueSheetRenderHelperOptions } from '../../vue/vue-render-helper'
import { VueActorSheet } from '../../vue/vueactorsheet'

export class FoeSheet extends VueActorSheet {
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      template: 'systems/foundry-ironsworn/templates/actor/foe.hbs',
      width: 450,
      height: 500,
    })
  }

  get renderHelperOptions(): Partial<VueSheetRenderHelperOptions> {
    return {
      components: { 'foe-sheet': foeSheetVue },
    }
  }

  _getHeaderButtons() {
    return [
      {
        class: 'ironsworn-toggle-edit-mode',
        label: 'Edit',
        icon: 'fas fa-edit',
        onclick: () => {
          const item = this.actor.items.find((x) => x.type === 'progress')
          item?.sheet?.render(true)
        },
      },
      ...super._getHeaderButtons(),
    ]
  }
}
