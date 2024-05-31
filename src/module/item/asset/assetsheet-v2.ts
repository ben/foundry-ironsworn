import assetSheetVue from '../../vue/asset-sheet.vue'
import { VueItemSheet } from '../../vue/vueitemsheet'

export class AssetSheetV2 extends VueItemSheet {
	static get defaultOptions() {
		return foundry.utils.mergeObject(super.defaultOptions, {
			width: 450,
			rootComponent: assetSheetVue
		}) as any
	}
}
