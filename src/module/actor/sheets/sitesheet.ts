import { VueActorSheet } from '../../vue/vueactorsheet'
import siteSheetVue from '../../vue/site-sheet.vue'
export class IronswornSiteSheet extends VueActorSheet {
	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			width: 750,
			height: 700,
			rootComponent: siteSheetVue
		}) as any
	}

	async _onDropActor(event: DragEvent, data: ActorSheet.DropData.Actor) {
		// Fetch the actor. We only want to override denizens (foe-type actors)
		const droppedActor = await Actor.fromDropData(data as any)
		if (droppedActor == null) return false
		if (droppedActor.type !== 'foe') {
			return await super._onDropActor(event, data)
		}
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
		const idx = parseInt(dropTarget?.dataset.idx || '')
		const { denizens } = this.actor.system as SiteDataSourceData
		if (!denizens[idx]) return false

		// Set the denizen description
		denizens[idx].text = droppedActor.link
		this.actor.update({ system: { denizens } }, { render: true })
		return true
	}
}
