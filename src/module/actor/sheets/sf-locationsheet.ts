import { IronswornSettings } from '../../helpers/settings'
import { IronswornVueActorSheet } from '../vueactorsheet'

export class StarforgedLocationSheet extends IronswornVueActorSheet {
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: [
        'ironsworn',
        'sheet',
        'actor',
        `theme-${IronswornSettings.theme}`,
      ],
      width: 400,
      height: 600,
      submitOnClose: true,
      submitOnChange: true,
      template: 'systems/foundry-ironsworn/templates/actor/sf-location.hbs',
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
}
