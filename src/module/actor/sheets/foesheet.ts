import foeSheetVue from '../../vue/components/foe-sheet.vue'
import { VueSheetRenderHelperOptions } from '../../vue/vue-render-helper'
import { VueActorSheet } from '../../vue/vueactorsheet'

export class FoeSheet extends VueActorSheet {
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      width: 450,
      height: 500,
    })
  }

  get renderHelperOptions(): Partial<VueSheetRenderHelperOptions> {
    return {
      rootComponent: foeSheetVue,
    }
  }

  // Override
  _toggleEditMode(e: JQuery.ClickEvent<any, any, any, any>): void {
    const item = this.actor?.items?.find((x) => x.type === 'progress')
    item?.sheet?.render(true)
  }
}
