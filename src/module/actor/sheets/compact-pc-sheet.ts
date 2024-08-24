import { VueActorSheet } from '../../vue/vueactorsheet'
import CompactCharacterSheet from '../../vue/compact-charactersheet.vue'
import { IronswornSettings } from '../../helpers/settings'
import { SFCharacterMoveSheet } from './sf-charactermovesheet'

export class CompactPCSheet extends VueActorSheet {
	static get defaultOptions() {
		return foundry.utils.mergeObject(super.defaultOptions, {
			width: 560,
			height: 210,
			resizable: true,
			rootComponent: CompactCharacterSheet
		}) as any
	}

	_getHeaderButtons() {
		return [
			{
				class: 'ironsworn-open-move-sheet',
				label: game.i18n.localize('IRONSWORN.ITEMS.TypeMove'),
				icon: 'fas fa-directions',
				onclick: (e) => {
					this._openMoveSheet(e)
				}
			},
			...super._getHeaderButtons()
		]
	}

	_openMoveSheet(e?: JQuery.ClickEvent) {
		e?.preventDefault()

		this.actor.moveSheet ||= new SFCharacterMoveSheet(this.actor)
		void this.actor.moveSheet.render(true, { focus: true })
	}
}
