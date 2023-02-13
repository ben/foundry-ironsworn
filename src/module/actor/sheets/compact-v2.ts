import { VueActorSheet } from '../../vue/vueactorsheet'
import CompactCharacterSheet from '../../vue/compact-charactersheet.vue'

export class CompactSheetV2 extends VueActorSheet {
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      width: 560,
      height: 210,
      resizable: false,
      rootComponent: CompactCharacterSheet,
    }) as any
  }
}
