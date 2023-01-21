import { VueSheetRenderHelperOptions } from '../vue/vue-render-helper'
import { VueAppMixin } from '../vue/vueapp'
import OracleWindowComponent from '../vue/oracle-window.vue'

export class OracleWindow extends VueAppMixin(Application) {
  static get defaultOptions(): ApplicationOptions {
    return mergeObject(super.defaultOptions, {
      title: game.i18n.localize('IRONSWORN.ROLLTABLES.TypeOracle'),
      template: 'systems/foundry-ironsworn/templates/oracle-window.hbs',
      id: 'oracles',
      resizable: true,
      width: 350,
      height: 400,
    })
  }

  get renderHelperOptions(): Partial<VueSheetRenderHelperOptions> {
    return {
      components: { Oracles: OracleWindowComponent },
    }
  }
}
