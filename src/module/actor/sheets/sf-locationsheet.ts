import sfLocationsheetVue from '../../vue/sf-locationsheet.vue'
import { VueActorSheet } from '../../vue/vueactorsheet'

export class StarforgedLocationSheet extends VueActorSheet {
	static get defaultOptions() {
		return foundry.utils.mergeObject(super.defaultOptions, {
			width: 600,
			height: 600,
			rootComponent: sfLocationsheetVue
		}) as any
	}
}
