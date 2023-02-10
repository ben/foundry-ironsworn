import progressSheetVue from '../../vue/progress-sheet.vue'
import { VueSheetRenderHelperOptions } from '../../vue/vue-render-helper'
import { VueItemSheet } from '../../vue/vueitemsheet'

export class ProgressSheetV2 extends VueItemSheet {
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      height: 550,
    })
  }

  get renderHelperOptions(): Partial<VueSheetRenderHelperOptions> {
    return {
      rootComponent: progressSheetVue,
    }
  }

  get hasEditMode(): boolean {
    return false
  }
}
