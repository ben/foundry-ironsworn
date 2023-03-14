import bondsetSheetVue from '../../vue/bondset-sheet.vue'
import { VueItemSheet } from '../../vue/vueitemsheet'

export class BondsetSheetV2 extends VueItemSheet {
	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			width: 800,
			rootComponent: bondsetSheetVue
		}) as any
	}
}
