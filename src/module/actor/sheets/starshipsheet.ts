import starshipSheetVue from '../../vue/starship-sheet.vue'
import { VueActorSheet } from '../../vue/vueactorsheet'

export class StarshipSheet extends VueActorSheet {
	static get defaultOptions() {
		return foundry.utils.mergeObject(super.defaultOptions, {
			width: 500,
			height: 500,
			rootComponent: starshipSheetVue
		}) as any
	}
}
