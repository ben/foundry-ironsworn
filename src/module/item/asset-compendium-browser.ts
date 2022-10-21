import { VueSheetRenderHelperOptions } from '../vue/vue-render-helper'
import AssetCompendiumBrowserVue from '../vue/asset-compendium-browser.vue'
import { VueAppMixin } from '../vue/vueapp.js'

export class AssetCompendiumBrowser extends VueAppMixin(Application) {
  constructor(
    protected toolset: 'starforged' | 'ironsworn',
    options?: Partial<ApplicationOptions>
  ) {
    super(options)
  }

  static get defaultOptions(): ApplicationOptions {
    return mergeObject(super.defaultOptions, {
      title: game.i18n.localize('IRONSWORN.Assets'),
      width: 400,
      height: 600,
      resizable: true,
      template:
        'systems/foundry-ironsworn/templates/asset-compendium-browser.hbs',
    })
  }

  get renderHelperOptions(): Partial<VueSheetRenderHelperOptions> {
    return {
      components: { 'asset-compendium-browser': AssetCompendiumBrowserVue },
      vueData: async () => ({ toolset: this.toolset }),
    }
  }
}
