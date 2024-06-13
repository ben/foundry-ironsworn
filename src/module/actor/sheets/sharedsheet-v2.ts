import sharedSheetVue from '../../vue/shared-sheet.vue'
import { VueActorSheet } from '../../vue/vueactorsheet'

export class IronswornSharedSheetV2 extends VueActorSheet {
	static get defaultOptions() {
		return foundry.utils.mergeObject(super.defaultOptions, {
			width: 425,
			height: 700,
			rootComponent: sharedSheetVue
		}) as any
	}
}
