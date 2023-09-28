import type { App } from 'vue'
import type { IronswornItem } from '../item/item'
import { $ActorKey } from './provisions'
import { VueAppMixin } from './vueapp.js'

export abstract class VueActorSheet extends VueAppMixin(ActorSheet) {
	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			classes: ['ironsworn', 'actor']
		})
	}

	setupVueApp(app: App) {
		app.provide($ActorKey, this.actor)
	}

	getData(...args): MaybePromise<object> {
		return {
			...super.getData(...args),
			actor: this.actor.toObject(false)
		}
	}

	async close(...args) {
		this.actor.moveSheet?.close(...args)
		await super.close(...args)
	}

	_getHeaderButtons() {
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

	_toggleEditMode(e: JQuery.ClickEvent) {
		e.preventDefault()

		const currentValue = this.actor.getFlag('foundry-ironsworn', 'edit-mode')
		this.actor.setFlag('foundry-ironsworn', 'edit-mode', !currentValue)
	}

	protected async _onDrop(event: DragEvent) {
		const data = (TextEditor as any).getDragEventData(event)

		if (data.type === 'AssetBrowserData') {
			const document = (await fromUuid(data.uuid)) as
				| StoredDocument<IronswornItem>
				| undefined

			if (document != null) {
				this.actor.createEmbeddedDocuments('Item', [
					(document as any).toObject()
				])
			}
		}

		super._onDrop(event)
	}
}
