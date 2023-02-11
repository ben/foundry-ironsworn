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
      title: game.i18n.localize('IRONSWORN.ITEMS.TypeAsset'),
      width: 400,
      height: 600,
      resizable: true,
    })
  }

  get renderHelperOptions(): Partial<VueSheetRenderHelperOptions> {
    return {
      rootComponent: AssetCompendiumBrowserVue,
      vueData: async () => ({ toolset: this.toolset }),
    }
  }
}
