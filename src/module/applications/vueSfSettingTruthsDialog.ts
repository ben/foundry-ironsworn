import { Starforged, starforged } from 'dataforged'
import sfTruthsVue from '../vue/sf-truths.vue'
import { VueSheetRenderHelperOptions } from '../vue/vue-render-helper'
import { VueAppMixin } from '../vue/vueapp.js'
import { App } from 'vue'

export class SFSettingTruthsDialogVue extends VueAppMixin(Application) {
  static get defaultOptions(): ApplicationOptions {
    return mergeObject(super.defaultOptions, {
      title: game.i18n.localize('IRONSWORN.SFSettingTruthsTitle'),
      template: 'systems/foundry-ironsworn/templates/sf-truths-vue.hbs',
      id: 'setting-truths-dialog',
      resizable: true,
      width: 600,
      height: 700,
    })
  }

  get renderHelperOptions(): Partial<VueSheetRenderHelperOptions> {
    return {
      components: { 'sf-truths': sfTruthsVue },
      vueData: async () => ({
        // Avoid rollupjs's over-aggressive tree shaking
        truths: ((starforged as any).default as Starforged)['Setting Truths'],
      }),
    }
  }
}
