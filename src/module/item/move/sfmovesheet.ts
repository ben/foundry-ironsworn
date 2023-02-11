import sfmoveSheetVue from '../../vue/sfmove-sheet.vue'
import { VueSheetRenderHelperOptions } from '../../vue/vue-render-helper'
import { VueItemSheet } from '../../vue/vueitemsheet'

export class SFMoveSheet extends VueItemSheet {
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      height: 650,
    })
  }

  get renderHelperOptions(): Partial<VueSheetRenderHelperOptions> {
    return {
      rootComponent: sfmoveSheetVue,
    }
  }
}
