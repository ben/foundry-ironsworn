import type { App } from 'vue'
import { $ItemKey } from './provisions'
import { VueAppMixin } from './vueapp.js'

export abstract class VueItemSheet extends VueAppMixin(ItemSheet) {
	static get defaultOptions() {
		return foundry.utils.mergeObject(super.defaultOptions, {
			classes: ['ironsworn', 'item'],
			width: 520,
			height: 480
		})
	}

	setupVueApp(app: App) {
		app.provide($ItemKey, this.item)
	}

	getData(...args): MaybePromise<object> {
		return {
			...super.getData(...args),
			item: this.item.toObject()
		}
	}

	readonly hasEditMode: boolean = true
	_getHeaderButtons() {
		if (this.hasEditMode) {
			return [
				{
					class: 'ironsworn-toggle-edit-mode',
					label: game.i18n.localize('IRONSWORN.Edit'),
					icon: 'fas fa-edit',
					onclick: (e) => {
						this._toggleEditMode(e)
					}
				},
				...super._getHeaderButtons()
			]
		}
		return super._getHeaderButtons()
	}

	_toggleEditMode(_e: JQuery.ClickEvent) {
		const currentValue = this.item.getFlag('foundry-ironsworn', 'edit-mode')
		this.item.setFlag('foundry-ironsworn', 'edit-mode', !currentValue)
	}
}
