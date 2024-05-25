import editSectorVue from '../../vue/edit-sector.vue'
import { VueAppMixin } from '../../vue/vueapp.js'

export class EditSectorDialog extends VueAppMixin(Application) {
	constructor(protected sceneId: string) {
		super()
	}

	static get defaultOptions() {
		return foundry.utils.mergeObject(super.defaultOptions, {
			title: game.i18n.localize('IRONSWORN.SCENE.TypeSector'),
			id: 'edit-sector-dialog',
			resizable: true,
			left: 115,
			top: 60,
			width: 400,
			height: 200,
			rootComponent: editSectorVue
		}) as any
	}

	getData(
		options?: Partial<ApplicationOptions> | undefined
	): MaybePromise<object> {
		return {
			...super.getData(options),
			sceneId: this.sceneId
		}
	}
}
