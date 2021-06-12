import { attachInlineRollListeners, IronswornRollDialog } from '../../helpers/roll'
import { capitalize } from '../../helpers/util'
import { IronswornActor } from '../actor'
import { IronswornCharacterData } from '../actortypes'
import { CharacterMoveSheet } from './charactermovesheet'

export interface CharacterSheetOptions extends BaseEntitySheet.Options {
  xyz?: string
}

export class IronswornCharacterSheet extends ActorSheet<ActorSheet.Data<IronswornActor>, IronswornActor> {
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ['ironsworn', 'sheet', 'actor'],
      width: 700,
      height: 800,
      left: 50,
      template: 'systems/foundry-ironsworn/templates/actor/character.hbs',
      dragDrop: [{ dragSelector: '.item-list .item', dropSelector: null }],
    } as CharacterSheetOptions)
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

    html.find('.ironsworn__builtin__move').each((_i, el) => {
      attachInlineRollListeners($(el), { actor: this.actor, name: el.dataset.name })
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

  _toggleEditMode(e: JQuery.ClickEvent) {
    e.preventDefault()

    const currentValue = this.actor.getFlag('foundry-ironsworn', 'edit-mode')
    this.actor.setFlag('foundry-ironsworn', 'edit-mode', !currentValue)
  }

  _openMoveSheet(e?: JQuery.ClickEvent) {
    e?.preventDefault()

    if (this.actor.moveSheet) {
      this.actor.moveSheet.render(true, {focus: true} as any) // TODO: fix this cast
    } else {
      new CharacterMoveSheet(this.actor).render(true)
    }
  }

  _onBurnMomentum(ev) {
    ev.preventDefault()

    const { momentum, momentumReset } = this.actor.data.data as IronswornCharacterData
    if (momentum > momentumReset) {
      this.actor.update({
        data: { momentum: momentumReset },
      })
    }
  }

  _onStatRoll(ev: JQuery.ClickEvent) {
    ev.preventDefault()

    const el = ev.currentTarget
    const stat = el.dataset.stat
    if (stat) {
      const rollText = game.i18n.localize('IRONSWORN.Roll')
      const statText = game.i18n.localize(`IRONSWORN.${capitalize(stat)}`)
      IronswornRollDialog.showDialog(this.actor.data.data, stat, `${rollText} +${statText}`)
    }
  }

  _onStatSet(ev: JQuery.ClickEvent) {
    ev.preventDefault()

    const el = ev.currentTarget
    const { resource, value } = el.dataset
    if (resource) {
      // Clicked a value in momentum/health/etc, set the value
      const newValue = parseInt(value)
      const { momentumMax } = this.actor.data.data as IronswornCharacterData
      if (resource !== 'momentum' || newValue <= momentumMax) {
        this.actor.update({ data: { [resource]: newValue } })
      }
    }
  }
}
