import { RollDialog } from '../../helpers/roll'
import { IronswornSettings } from '../../helpers/settings'

export class IronswornSharedSheet extends ActorSheet {
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ['ironsworn', 'sheet', 'shared', `theme-${IronswornSettings.theme}`],
      width: 350,
      height: 700,
      template: 'systems/foundry-ironsworn/templates/actor/shared.hbs',
    })
  }

  activateListeners(html: JQuery) {
    super.activateListeners(html)

    html.find('.ironsworn__supply__roll').on('click', (e) => this._onSupplyRoll.call(this, e))
    html.find('.ironsworn__supply__value').on('click', (e) => this._onSupplySet.call(this, e))

    // Custom sheet listeners for every ItemType
    for (const itemClass of CONFIG.IRONSWORN.itemClasses) {
      itemClass.activateActorSheetListeners(html, this)
    }
  }

  getData() {
    let data: any = super.getData()

    data.vows = this.actor.items.filter((x) => x.type === 'vow')
    data.progresses = this.actor.items.filter((x) => x.type === 'progress')
    data.bonds = this.actor.items.find((x) => x.type === 'bondset')

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

  _onSupplyRoll(ev: JQuery.ClickEvent) {
    ev.preventDefault()
    RollDialog.show({
      actor: this.actor,
      stat: 'supply',
    })
  }

  _onSupplySet(ev: JQuery.ClickEvent) {
    ev.preventDefault()

    const el = ev.currentTarget
    const { value } = el.dataset
    // Clicked a value in momentum/health/etc, set the value
    const newValue = parseInt(value)
    this.actor.update({ data: { supply: newValue } })
    IronswornSettings.maybeSetGlobalSupply(newValue)
  }
}
