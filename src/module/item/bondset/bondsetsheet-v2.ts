import bondsetSheetVue from '../../vue/bondset-sheet.vue'
import { VueItemSheet } from '../../vue/vueitemsheet'

export class BondsetSheetV2 extends VueItemSheet {
	static get defaultOptions() {
		return foundry.utils.mergeObject(super.defaultOptions, {
			width: 800,
			rootComponent: bondsetSheetVue
		}) as any
	}
}
