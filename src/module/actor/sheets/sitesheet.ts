import { compact } from 'lodash'
import { RANK_INCREMENTS } from '../../constants'
import { EnhancedDataswornMove, moveDataByName } from '../../helpers/data'
import { RollDialog, rollSiteFeature } from '../../helpers/roll'
import { IronswornSettings } from '../../helpers/settings'
import { IronswornItem } from '../../item/item'
import { IronswornActor } from '../actor'
import { SiteDataSource } from '../actortypes'

interface Data extends ActorSheet.Data<ActorSheet.Options> {
  theme?: IronswornItem
  domain?: IronswornItem
  moves: EnhancedDataswornMove[]
}

export class IronswornSiteSheet extends ActorSheet<ActorSheet.Options, Data> {
  get siteData() {
    return this.actor.data as SiteDataSource
  }
  get theme() {
    return this.actor.items.find((x) => x.type === 'delve-theme')
  }
  get domain() {
    return this.actor.items.find((x) => x.type === 'delve-domain')
  }

  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ['ironsworn', 'sheet', 'site', `theme-${IronswornSettings.theme}`],
      width: 700,
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

  async getData() {
    const data = await super.getData()

    data.theme = this.theme
    data.domain = this.domain
    data.moves = await this.moves()

    return data
  }

  async moves(): Promise<EnhancedDataswornMove[]> {
    const moveNames = [
      'Delve the Depths',
      'Find an Opportunity',
      'Locate Your Objective',
      'Escape the Depths'
    ]
    const sparseMoves = await Promise.all(moveNames.map(moveDataByName))
    return compact(sparseMoves)
  }

  activateListeners(html: JQuery) {
    super.activateListeners(html)
    for (const itemClass of CONFIG.IRONSWORN.itemClasses) {
      itemClass.activateActorSheetListeners(html, this)
    }

    html.find('.ironsworn__progress__rank').on('click', (ev) => this._setRank.call(this, ev))
    html.find('.ironsworn__progress__mark').on('click', (ev) => this._markProgress.call(this, ev))
    html.find('.ironsworn__progress__clear').on('click', (ev) => this._clearProgress.call(this, ev))

    html.find('.ironsworn__builtin__move__roll').on('click', (ev) => this._moveRoll.call(this, ev))
    html.find('.ironsworn__compendium__open').on('click', (ev) => this._openCompendium.call(this, ev))
    html.find('.ironsworn__feature__roll').on('click', (ev) => this._randomFeature.call(this, ev))
    html.find('.ironsworn__danger__roll').on('click', (ev) => this._revealDanger.call(this, ev))
  }

  _setRank(ev: JQuery.ClickEvent) {
    ev.preventDefault()
    this.actor.update({ 'data.rank': ev.currentTarget.dataset.rank })
  }

  _markProgress(ev: JQuery.ClickEvent) {
    ev.preventDefault()

    const increment = RANK_INCREMENTS[this.siteData.data.rank]
    const newValue = Math.min(this.siteData.data.current + increment, 40)
    this.actor.update({ 'data.current': newValue })
  }

  _clearProgress(ev: JQuery.ClickEvent) {
    ev.preventDefault()
    this.actor.update({ 'data.current': 0 })
  }

  async _moveRoll(ev: JQuery.ClickEvent) {
    ev.preventDefault()

    const move = await moveDataByName(ev.currentTarget.dataset.name)
    const actor = await this.findActor()
    RollDialog.show({ actor, move })
  }

  _openCompendium(ev: JQuery.ClickEvent) {
    ev.preventDefault()
    const { compendium } = ev.currentTarget.dataset
    const pack = game.packs?.get(`foundry-ironsworn.${compendium}`)
    pack?.render(true)
  }

  _randomFeature(ev: JQuery.ClickEvent) {
    ev.preventDefault()

    rollSiteFeature({
      domain: this.domain,
      theme: this.theme,
    })
  }

  async _revealDanger(ev: JQuery.ClickEvent) {
    ev.preventDefault()
  }

  findActor(): IronswornActor {
    if (game.user?.character) return game.user.character

    // TODO: if more than one character, prompt the user
    const actor = game.actors?.find((x) => x.type === 'character')
    if (!actor) {
      ui.notifications?.error("Couldn't find a character for you")
      throw new Error("Couldn't find an actor")
    }
    return actor
  }
}
