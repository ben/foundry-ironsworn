import { RANK_INCREMENTS } from '../../constants'
import { IronswornSettings } from '../../helpers/settings'
import { IronswornItem } from '../../item/item'
import { SiteDataSource } from '../actortypes'

interface Data extends ActorSheet.Data<ActorSheet.Options> {
  theme?: IronswornItem
  domain?: IronswornItem
}

export class IronswornSiteSheet extends ActorSheet<ActorSheet.Options, Data> {
  get siteData() {
    return this.actor.data as SiteDataSource
  }

  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ['ironsworn', 'sheet', 'site', `theme-${IronswornSettings.theme}`],
      width: 600,
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

    data.theme = this.actor.items.find((x) => x.type === 'delve-theme')
    data.domain = this.actor.items.find((x) => x.type === 'delve-domain')

    return data
  }

  activateListeners(html: JQuery) {
    super.activateListeners(html)

    html.find('.ironsworn__progress__rank').on('click', ev => this._setRank.call(this, ev))
    html.find('.ironsworn__progress__mark').on('click', (ev) => this._markProgress.call(this, ev))
    html.find('.ironsworn__progress__clear').on('click', (ev) => this._clearProgress.call(this, ev))
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
}
