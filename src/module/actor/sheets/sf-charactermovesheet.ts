import CharacterMoveSheet from '../../vue/sf-charactermovesheet.vue'
import type { IronswornActor } from '../actor'
import type { App } from 'vue'
import { $ActorKey } from '../../vue/provisions'
import { VueAppMixin } from '../../vue/vueapp.js'
import { MoveSheetTour } from '../../features/tours/move-sheet-tour'

export class SFCharacterMoveSheet extends VueAppMixin(Application) {
	constructor(
		protected actor: IronswornActor,
		protected toolset:
			| 'ironsworn'
			| 'starforged'
			| 'sunderedisles' = 'starforged',
		options?: Partial<ApplicationOptions>
	) {
		super(options)
	}

	getData(
		options?: Partial<ApplicationOptions> | undefined
	): MaybePromise<object> {
		return {
			...super.getData(options),
			toolset: this.toolset,
			actor: this.actor.toObject()
		}
	}

	setupVueApp(app: App<any>): void {
		app.provide($ActorKey, this.actor)
	}

	static get defaultOptions() {
		return foundry.utils.mergeObject(super.defaultOptions, {
			resizable: true,
			width: 350,
			height: 820,
			left: 685,
			rootComponent: CharacterMoveSheet
		}) as any
	}

	get title() {
		return `${game.i18n.localize('IRONSWORN.ITEMS.TypeMove')} — ${
			this.actor.name
		}`
	}

	activateTab(tabKey: string) {
		this.localEmitter.emit('activateTab', tabKey)
	}

	protected _getHeaderButtons(): Application.HeaderButton[] {
		return [
			{
				class: 'ironsworn-help',
				icon: 'fa fa-circle-question',
				label: '',
				onclick: async () => {
					const tour = new MoveSheetTour(this)
					await tour.reset()
					tour.start()
				}
			},
			...super._getHeaderButtons()
		]
	}
}

// When changing actor sheets, make sure we don't get a stale move sheet
Hooks.on('preUpdateActor', async (actor: IronswornActor, data: any) => {
	if (actor.type === 'character' && data.flags?.core?.sheetClass) {
		await actor.moveSheet?.close()
		actor.moveSheet = undefined
	}
})
Hooks.on('preUpdateSetting', async (setting: Setting, data: any) => {
	if (setting.key === 'core.sheetClasses') {
		for (const actor of game.actors ?? []) {
			await actor.moveSheet?.close()
			actor.moveSheet = undefined
		}
	}
})
