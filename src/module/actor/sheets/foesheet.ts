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

  // Override
  _toggleEditMode(e: JQuery.ClickEvent<any, any, any, any>): void {
    const item = this.actor?.items?.find((x) => x.type === 'progress')
    item?.sheet?.render(true)
  }
}
