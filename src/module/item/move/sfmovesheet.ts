import sfmoveSheetVue from '../../vue/sfmove-sheet.vue'
import { VueItemSheet } from '../../vue/vueitemsheet'

export class SFMoveSheet extends VueItemSheet {
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      height: 650,
      rootComponent: sfmoveSheetVue,
    }) as any
  }
}
