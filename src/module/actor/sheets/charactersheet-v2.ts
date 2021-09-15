import { IronswornSettings } from '../../helpers/settings'
import { IronswornVueActorSheet } from '../vueactorsheet'

export class IronswornCharacterSheetV2 extends IronswornVueActorSheet {
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ['ironsworn', 'sheet', 'actor', `theme-${IronswornSettings.theme}`],
      width: 700,
      height: 800,
      left: 50,
      submitOnClose: true,
      submitOnChange: true,
      template: 'systems/foundry-ironsworn/templates/actor/character-v2.hbs',
    })
  }

  getData() {
    let data: any = super.getData()

    data.assets = this.actor.items.filter((x) => x.type === 'asset')
    data.vows = this.actor.items.filter((x) => x.type === 'vow')
    data.progresses = this.actor.items.filter((x) => x.type === 'progress')
    data.bonds = this.actor.items.find((x) => x.type === 'bondset')

    // Allow every itemtype to add data to the actorsheet
    for (const itemType of CONFIG.IRONSWORN.itemClasses) {
      data = itemType.getActorSheetData(data, this)
    }

    data.actor = this.actor.toObject(false)
    data.data = data.actor.data;

    return data
  }
}
