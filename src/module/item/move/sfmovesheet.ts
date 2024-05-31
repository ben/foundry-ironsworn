import sfmoveSheetVue from '../../vue/sfmove-sheet.vue'
import { VueItemSheet } from '../../vue/vueitemsheet'

export class SFMoveSheet extends VueItemSheet {
	static get defaultOptions() {
		return foundry.utils.mergeObject(super.defaultOptions, {
			height: 650,
			rootComponent: sfmoveSheetVue
		}) as any
	}
}
