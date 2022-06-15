import { IronswornSettings } from '../../helpers/settings'
import { StarshipDataSource } from '../actortypes'
import { IronswornVueActorSheet } from '../vueactorsheet'

export class StarshipSheet extends IronswornVueActorSheet {
  get starshipData() {
    return this.actor.data as StarshipDataSource
  }

  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: [
        'ironsworn',
        'sheet',
        'starship',
        `theme-${IronswornSettings.theme}`,
      ],
      width: 500,
      height: 500,
      template: 'systems/foundry-ironsworn/templates/actor/starship.hbs',
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
