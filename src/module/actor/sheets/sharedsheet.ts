import { IronswornSettings } from '../../helpers/settings'
import { IronswornActor } from '../actor'

export class IronswornSharedSheet extends ActorSheet<ActorSheet.Data<IronswornActor>, IronswornActor> {
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ['ironsworn', 'sheet', 'shared', `theme-${IronswornSettings.theme}`],
      width: 350,
      height: 600,
      template: 'systems/foundry-ironsworn/templates/actor/shared.hbs',
    } as BaseEntitySheet.Options)
  }

  activateListeners(html: JQuery) {
    super.activateListeners(html)

    // Custom sheet listeners for every ItemType
    for (const itemClass of CONFIG.IRONSWORN.itemClasses) {
      itemClass.activateActorSheetListeners(html, this)
    }
  }

  getData() {
    let data: any = super.getData()

    data.vows = this.actor.items.filter((x) => x.type === 'vow')
    data.progresses = this.actor.items.filter((x) => x.type === 'progress')

    // Allow every itemtype to add data to the actorsheet
    for (const itemType of CONFIG.IRONSWORN.itemClasses) {
      data = itemType.getActorSheetData(data, this)
    }

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

  _toggleEditMode(e: JQuery.ClickEvent) {
    e.preventDefault()

    const currentValue = this.actor.getFlag('foundry-ironsworn', 'edit-mode')
    this.actor.setFlag('foundry-ironsworn', 'edit-mode', !currentValue)
  }
}
