import { VueActorSheet } from '../../vue/vueactorsheet'
import CompactCharacterSheet from '../../vue/compact-charactersheet.vue'
import { IronswornSettings } from '../../helpers/settings'
import { SFCharacterMoveSheet } from './sf-charactermovesheet'

export class CompactPCSheet extends VueActorSheet {
	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			width: 560,
			height: 300,
			resizable: true,
			rootComponent: CompactCharacterSheet
		}) as any
	}

	constructor(
		...[object, options]: ConstructorParameters<typeof VueActorSheet>
	) {
		const baseHeight = 240
		const customImpactRowHeight = 35
		// the extra +1 represents the "add custom impact" button
		const customImpactRows = Math.ceil((object.customImpacts.length + 1) / 3)
		const height = baseHeight + customImpactRowHeight * customImpactRows

		super(object, { ...options, height })
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
		].map((btn) => Object.assign(btn, { tooltip: btn.label, label: '' }))
	}

	_openMoveSheet(e?: JQuery.ClickEvent) {
		e?.preventDefault()

		this.actor.moveSheet ||= new SFCharacterMoveSheet(
			this.actor,
			IronswornSettings.get('toolbox') === 'starforged'
				? 'starforged'
				: 'ironsworn'
		)
		this.actor.moveSheet.render(true, { focus: true })
	}
}
