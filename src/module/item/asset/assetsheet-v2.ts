import assetSheetVue from '../../vue/asset-sheet.vue'
import { VueSheetRenderHelperOptions } from '../../vue/vue-render-helper'
import { VueItemSheet } from '../../vue/vueitemsheet'

export class AssetSheetV2 extends VueItemSheet {
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      template: 'systems/foundry-ironsworn/templates/item/assetv2.hbs',
      width: 450,
    })
  }

  get renderHelperOptions(): Partial<VueSheetRenderHelperOptions> {
    return {
      components: { 'asset-sheet': assetSheetVue },
    }
  }
}
