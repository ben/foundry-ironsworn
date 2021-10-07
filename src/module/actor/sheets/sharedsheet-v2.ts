import { IronswornSettings } from '../../helpers/settings'
import { IronswornVueActorSheet } from '../vueactorsheet'

export class IronswornSharedSheetV2 extends IronswornVueActorSheet {
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ['ironsworn', 'sheet', 'shared', `theme-${IronswornSettings.theme}`],
      width: 350,
      height: 700,
      template: 'systems/foundry-ironsworn/templates/actor/shared-v2.hbs',
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
