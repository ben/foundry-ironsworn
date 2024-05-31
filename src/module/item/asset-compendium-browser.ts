import AssetCompendiumBrowserVue from '../vue/asset-compendium-browser.vue'
import { VueAppMixin } from '../vue/vueapp.js'

export class AssetCompendiumBrowser extends VueAppMixin(Application) {
	constructor(
		protected toolset: 'starforged' | 'ironsworn',
		options?: Partial<ApplicationOptions>
	) {
		super(options)
	}

	static get defaultOptions() {
		return foundry.utils.mergeObject(super.defaultOptions, {
			title: game.i18n.localize('IRONSWORN.ITEMS.TypeAsset'),
			width: 400,
			height: 600,
			resizable: true,
			rootComponent: AssetCompendiumBrowserVue
		}) as any
	}

	getData(
		options?: Partial<ApplicationOptions> | undefined
	): MaybePromise<object> {
		return {
			...super.getData(),
			toolset: this.toolset
		}
	}
}
