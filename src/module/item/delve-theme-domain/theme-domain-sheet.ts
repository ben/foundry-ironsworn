import { VueItemSheet } from '../../vue/vueitemsheet'
import delveThemeDomainSheet from '../../vue/delve-theme-domain-sheet.vue'

export class ThemeDomainSheet extends VueItemSheet {
	static get defaultOptions() {
		return foundry.utils.mergeObject(super.defaultOptions, {
			height: 650,
			rootComponent: delveThemeDomainSheet
		} as any)
	}
}
