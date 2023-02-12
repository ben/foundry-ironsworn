import assetSheetVue from '../../vue/asset-sheet.vue'
import { VueSheetRenderHelperOptions } from '../../vue/vue-render-helper'
import { VueItemSheet } from '../../vue/vueitemsheet'

export class AssetSheetV2 extends VueItemSheet {
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      width: 450,
      rootComponent: assetSheetVue,
    })
  }
}
