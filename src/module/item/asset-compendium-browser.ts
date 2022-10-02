import { VueSheetRenderHelperOptions } from '../vue/vue-render-helper'
import { VueApplication } from '../vue/vueapp'
import AssetCompendiumBrowserVue from '../vue/asset-compendium-browser.vue'

export class AssetCompendiumBrowser extends VueApplication {
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
