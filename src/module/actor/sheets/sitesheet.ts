import { IronswornSettings } from "../../helpers/settings"
import { IronswornItem } from "../../item/item"
import { SiteDataSource } from "../actortypes"

interface Data extends ActorSheet.Data<ActorSheet.Options> {
  theme?: IronswornItem
  domain?: IronswornItem
}

export class IronswornSiteSheet extends ActorSheet<ActorSheet.Options, Data> {
  get siteData() {
    return this.actor.data as SiteDataSource
  }

  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ['ironsworn', 'sheet', 'site', `theme-${IronswornSettings.theme}`],
      width: 600,
      height: 700,
      template: 'systems/foundry-ironsworn/templates/actor/site.hbs',
    })
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

  _toggleEditMode(e: JQuery.ClickEvent) {
    e.preventDefault()

    const currentValue = this.actor.getFlag('foundry-ironsworn', 'edit-mode')
    this.actor.setFlag('foundry-ironsworn', 'edit-mode', !currentValue)
  }

  activateListeners(html: JQuery) {
    super.activateListeners(html)
  }

  async getData() {
    const data = await super.getData()

    data.theme = this.actor.items.find(x => x.type === 'delve-theme')
    data.domain = this.actor.items.find(x => x.type === 'delve-domain')

    return data
  }
}
