import foeSheetVue from '../../vue/components/foe-sheet.vue'
import { VueActorSheet } from '../../vue/vueactorsheet'

export class FoeSheet extends VueActorSheet {
	static get defaultOptions() {
		return foundry.utils.mergeObject(super.defaultOptions, {
			width: 450,
			height: 500,
			rootComponent: foeSheetVue
		}) as any
	}

	// Override
	_toggleEditMode(e: JQuery.ClickEvent<any, any, any, any>): void {
		const item = this.actor?.items?.find((x) => x.type === 'progress')
		item?.sheet?.render(true)
	}
}
