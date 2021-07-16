import { IronswornSettings } from "../../helpers/settings"
import { SiteDataSource } from "../actortypes"

export class IronswornSiteSheet extends ActorSheet {
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ['ironsworn', 'sheet', 'site', `theme-${IronswornSettings.theme}`],
      width: 350,
      height: 700,
      template: 'systems/foundry-ironsworn/templates/actor/site.hbs',
    })
  }

  get siteData() {
    return this.actor.data as SiteDataSource
  }

  activateListeners(html: JQuery) {
    super.activateListeners(html)
  }

  getData() {
    const data = super.getData()

    return data
  }
}
