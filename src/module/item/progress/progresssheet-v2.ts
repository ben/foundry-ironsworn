import progressSheetVue from '../../vue/progress-sheet.vue'
import { VueItemSheet } from '../../vue/vueitemsheet'

export class ProgressSheetV2 extends VueItemSheet {
	static get defaultOptions() {
		return foundry.utils.mergeObject(super.defaultOptions, {
			height: 550,
			rootComponent: progressSheetVue
		}) as any
	}

	readonly hasEditMode = false
}
