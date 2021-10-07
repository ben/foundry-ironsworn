import { IronswornSettings } from '../../helpers/settings'
import { SiteDataSource } from '../actortypes'
import { IronswornVueActorSheet } from '../vueactorsheet'

export class IronswornSiteSheetV2 extends IronswornVueActorSheet {
  get siteData() {
    return this.actor.data as SiteDataSource
  }

  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ['ironsworn', 'sheet', 'site', `theme-${IronswornSettings.theme}`],
      width: 700,
      height: 520,
      template: 'systems/foundry-ironsworn/templates/actor/site-v2.hbs',
      resizable: false,
      submitOnClose: true,
      submitOnChange: true,
    })
  }

  getData() {
    let data: any = super.getData()

    // Allow every itemtype to add data to the actorsheet
    for (const itemType of CONFIG.IRONSWORN.itemClasses) {
      data = itemType.getActorSheetData(data, this)
    }

    data.actor = this.actor.toObject(false)
    data.data = data.actor.data

    return data
  }

  async _onDropItem(event: DragEvent, data: ActorSheet.DropData.Item) {
    // Fetch the item. We only want to override denizens (progress-type items)
    const item = await Item.fromDropData(data)
    if (!item) return false
    if (item.type !== 'progress') {
      return super._onDropItem(event, data)
    }

    // Find which denizen slot this is going into
    const dropTarget = $(event.target as HTMLElement).parents('.ironsworn__denizen__drop')[0]
    if (!dropTarget) return false
    const idx = parseInt(dropTarget.dataset.idx || '')
    const { denizens } = this.siteData.data
    if (!denizens[idx]) return false

    // Set the denizen description
    const description = item.pack ? `@Compendium[${item.pack}.${item.id}]{${item.name}}` : item.link
    denizens[idx].description = description
    this.actor.update({ data: { denizens } }, { render: true })
    return true
  }

  _getHeaderButtons() {
    return [
      {
        class: 'ironsworn-toggle-edit-mode',
        label: 'Edit',
        icon: 'fas fa-edit',
        onclick: (e) => this._toggleEditMode(e),
      },
      ...super._getHeaderButtons(),
    ]
  }

  _toggleEditMode(_e: JQuery.ClickEvent) {
    const currentValue = this.actor.getFlag('foundry-ironsworn', 'edit-mode')
    this.actor.setFlag('foundry-ironsworn', 'edit-mode', !currentValue)
  }
}
