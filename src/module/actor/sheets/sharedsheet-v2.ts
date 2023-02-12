import sharedSheetVue from '../../vue/shared-sheet.vue'
import { VueActorSheet } from '../../vue/vueactorsheet'

export class IronswornSharedSheetV2 extends VueActorSheet {
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      width: 350,
      height: 700,
      rootComponent: sharedSheetVue,
    })
  }
}
