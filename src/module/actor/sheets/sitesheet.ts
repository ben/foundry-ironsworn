import { SiteDataSourceData } from '../actortypes'
import { VueActorSheet } from '../../vue/vueactorsheet'
import siteSheetVue from '../../vue/site-sheet.vue'

export class IronswornSiteSheet extends VueActorSheet {
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      width: 750,
      height: 700,
      rootComponent: siteSheetVue,
    }) as any
  }

  async _onDropItem(event: DragEvent, data: ActorSheet.DropData.Item) {
    // Fetch the item. We only want to override denizens (progress-type items)
    const item = await Item.fromDropData(data)
    if (!item) return false
    if (item.type !== 'progress') {
      return super._onDropItem(event, data)
    }

    // Find which denizen slot this is going into
    const dropTarget = $(event.target as HTMLElement).parents(
      '.ironsworn__denizen__drop'
    )[0]
    if (!dropTarget) return false
    const idx = parseInt(dropTarget.dataset.idx || '')
    const { denizens } = this.actor.system as SiteDataSourceData
    if (!denizens[idx]) return false

    // Set the denizen description
    denizens[idx].text = item.link
    this.actor.update({ system: { denizens } }, { render: true })
    return true
  }
}
