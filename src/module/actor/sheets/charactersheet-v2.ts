import { ISCharacterTour } from '../../features/tours/is-character-tour'
import { IronswornSettings } from '../../helpers/settings'
import characterSheetVue from '../../vue/character-sheet.vue'
import { VueActorSheet } from '../../vue/vueactorsheet'
import { SFCharacterMoveSheet } from './sf-charactermovesheet'

export class IronswornCharacterSheetV2 extends VueActorSheet {
	static get defaultOptions() {
		return foundry.utils.mergeObject(super.defaultOptions, {
			width: 700,
			height: 800,
			left: 50,
			rootComponent: characterSheetVue
		}) as any
	}

	activateTab(tabKey: string) {
		this.localEmitter.emit('activateTab', tabKey)
	}

	render(...args: any[]) {
		if (this._state <= Application.RENDER_STATES.NONE) this._openMoveSheet()
		return super.render(...args) as any
	}

	_getHeaderButtons() {
		const [editButton, sheetButton, tokenButton, ...otherButtons] =
			super._getHeaderButtons()
		return [
			{
				class: 'ironsworn-open-move-sheet',
				label: game.i18n.localize('IRONSWORN.ITEMS.TypeMove'),
				icon: 'fas fa-directions',
				onclick: (e) => {
					this._openMoveSheet(e)
				}
			},
			editButton,
			sheetButton,
			tokenButton,
			{
				class: 'ironsworn-help',
				icon: 'fa fa-circle-question',
				label: '',
				onclick: async (e) => {
					await new ISCharacterTour(this.actor).start()
				}
			},
			...otherButtons
		]
	}

	_openMoveSheet(_e?: JQuery.ClickEvent) {
		this.actor.moveSheet ||= new SFCharacterMoveSheet(this.actor, {
			left: 755
		})
		void this.actor.moveSheet.render(true, { focus: true })
	}
}
