import { VueActorSheet } from '../../vue/vueactorsheet'
import siteSheetVue from '../../vue/site-sheet.vue'

export class IronswornSiteSheet extends VueActorSheet {
	static get defaultOptions() {
		return foundry.utils.mergeObject(super.defaultOptions, {
			width: 600,
			height: 700,
			rootComponent: siteSheetVue
		}) as any
	}

	async _onDropItem(event: DragEvent, data: ActorSheet.DropData.Item) {
		if (!this.actor.assert('site'))
			throw new Error(
				'IronswornSiteSheet has an actor, but it doesn\'t have the "site" subtype'
			)
		// Fetch the item. We only want to override denizens (progress-type items)
		const item = await Item.fromDropData(data)
		if (item == null) return false
		if (!item.assert('progress')) {
			return await super._onDropItem(event, data)
		}

		// Find which denizen slot this is going into
		const dropTarget = $(event.target as HTMLElement).parents(
			'.ironsworn__denizen__drop'
		)[0]
		if (dropTarget == null) return false
		const idx = parseInt(dropTarget.dataset.idx || '')
		const { denizens } = this.actor.system
		if (!denizens[idx]) return false

		// Set the denizen description
		denizens[idx].text = item.link
		void this.actor.update({ system: { denizens } }, { render: true })
		return true
	}
}
