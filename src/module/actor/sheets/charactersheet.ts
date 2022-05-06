import { RollDialog } from '../../helpers/rolldialog'
import { IronswornSettings } from '../../helpers/settings'
import { IronswornItem } from '../../item/item'
import { CharacterMoveSheet } from './charactermovesheet'

export class IronswornCharacterSheet extends ActorSheet {
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ['ironsworn', 'sheet', 'actor', `theme-${IronswornSettings.theme}`],
      width: 700,
      height: 800,
      left: 50,
      template: 'systems/foundry-ironsworn/templates/actor/character.hbs',
    })
  }

  constructor(actor, options) {
    super(actor, options)

    this._openMoveSheet()
  }

  activateListeners(html: JQuery) {
    super.activateListeners(html)

    // Custom sheet listeners for every ItemType
    for (const itemClass of CONFIG.IRONSWORN.itemClasses) {
      itemClass.activateActorSheetListeners(html, this)
    }

    // Custom sheet listeners for every SheetComponent
    // for (const sheetComponent in CONFIG.IRONSWORN.sheetComponents.actor) {
    //   CONFIG.IRONSWORN.sheetComponents.actor[sheetComponent].activateListeners(html, this)
    // }

    html.find('.ironsworn__stat__roll').on('click', (e) => this._onStatRoll.call(this, e))
    html.find('.ironsworn__stat__value').on('click', (e) => this._onStatSet.call(this, e))
    html.find('.ironsworn__momentum__burn').on('click', (e) => this._onBurnMomentum.call(this, e))
  }

  getData() {
    let data: any = super.getData()

    data.assets = this.actor.items.filter((x) => x.type === 'asset')
    const rawProgresses = this.actor.items.filter((x) => x.type === 'progress') as IronswornItem[]
    data.vows = rawProgresses.filter((x) => (x.data.data as any)?.subtype === 'vow')
    data.progresses = rawProgresses.filter((x) => (x.data.data as any)?.subtype === 'progress')
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
      {
        class: 'ironsworn-open-move-sheet',
        label: 'Moves',
        icon: 'fas fa-directions',
        onclick: (e) => this._openMoveSheet(e),
      },
      ...super._getHeaderButtons(),
    ]
  }

  _toggleEditMode(_e: JQuery.ClickEvent) {
    const currentValue = this.actor.getFlag('foundry-ironsworn', 'edit-mode')
    this.actor.setFlag('foundry-ironsworn', 'edit-mode', !currentValue)
  }

  _openMoveSheet(_e?: JQuery.ClickEvent) {
    if (this.actor.moveSheet) {
      this.actor.moveSheet.render(true, { focus: true })
    } else {
      new CharacterMoveSheet(this.actor).render(true)
    }
  }

  _onBurnMomentum(_ev: JQuery.ClickEvent) {
    if (this.actor.data.type !== 'character') return
    this.actor.burnMomentum()
  }

  _onStatRoll(ev: JQuery.ClickEvent) {
    const el = ev.currentTarget
    const stat = el.dataset.stat
    if (stat) {
      RollDialog.show({ actor: this.actor, stat })
    }
  }

  _onStatSet(ev: JQuery.ClickEvent) {
    const el = ev.currentTarget
    const { resource, value } = el.dataset
    if (resource) {
      // Clicked a value in momentum/health/etc, set the value
      const newValue = parseInt(value)
      if (resource === 'momentum' && this.actor.data.type === 'character') {
        const { momentumMax } = this.actor.data.data
        if (newValue > momentumMax) {
          return
        }
      }

      this.actor.update({ data: { [resource]: newValue } })
      if (resource === 'supply') {
        IronswornSettings.maybeSetGlobalSupply(newValue)
      }
    }
  }
}
