import { VueApplication } from '../vue/vueapp'
import { starforged } from 'dataforged'
import sfTruthsVue from '../vue/sf-truths.vue'
import { VueSheetRenderHelperOptions } from '../vue/vue-render-helper'

export class SFSettingTruthsDialogVue extends VueApplication {
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
      ...super.renderHelperOptions,
      components: { 'sf-truths': sfTruthsVue },
      vueData: async () => ({
        // Avoid rollupjs's over-aggressive tree shaking
        truths: starforged.default['Setting Truths'],
      }),
    }
  }
}
