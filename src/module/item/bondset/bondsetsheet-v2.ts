import bondsetSheetVue from '../../vue/bondset-sheet.vue'
import { VueSheetRenderHelperOptions } from '../../vue/vue-render-helper'
import { VueItemSheet } from '../../vue/vueitemsheet'

export class BondsetSheetV2 extends VueItemSheet {
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      width: 800,
    })
  }

  get template() {
    return 'systems/foundry-ironsworn/templates/item/bondsetv2.hbs'
  }

  get renderHelperOptions(): Partial<VueSheetRenderHelperOptions> {
    return {
      components: { 'bondset-sheet': bondsetSheetVue },
    }
  }
}
