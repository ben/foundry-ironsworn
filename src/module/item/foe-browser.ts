import FoeBrowserVue from '../vue/foe-browser.vue'
import { VueAppMixin } from '../vue/vueapp.js'

export class FoeBrowser extends VueAppMixin(Application) {
	constructor() {
		super({})
	}

	static get defaultOptions() {
		return foundry.utils.mergeObject(super.defaultOptions, {
			title: game.i18n.localize('IRONSWORN.Foes'),
			width: 450,
			height: 600,
			resizable: true,
			rootComponent: FoeBrowserVue
		}) as any
	}
}
