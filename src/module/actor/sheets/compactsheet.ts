import { IronswornSettings } from '../../helpers/settings'
import { IronswornPrerollDialog } from '../../rolls'
import { CharacterDataPropertiesData } from '../actortypes'
import { SFCharacterMoveSheet } from './sf-charactermovesheet'

export class IronswornCompactCharacterSheet extends ActorSheet {
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: [
        'ironsworn',
        'sheet',
        'actor',
        `theme-${IronswornSettings.get('theme')}`,
      ],
      width: 560,
      height: 210,
      template: 'systems/foundry-ironsworn/templates/actor/compact.hbs',
      resizable: false,
    })
  }

  activateListeners(html: JQuery) {
    super.activateListeners(html)

    html
      .find('.ironsworn__stat__roll')
      .on('click', (e) => this._onStatRoll.call(this, e))
    html
      .find('.ironsworn__resource__adjust')
      .on('click', (e) => this._resourceAdjust.call(this, e))
    html
      .find('.ironsworn__momentum__burn')
      .on('click', (e) => this._momentumBurn.call(this, e))
  }

  _getHeaderButtons() {
    return [
      {
        class: 'ironsworn-open-move-sheet',
        label: game.i18n.localize('IRONSWORN.ITEMS.TypeMove'),
        icon: 'fas fa-directions',
        onclick: (e) => this._openMoveSheet(e),
      },
      ...super._getHeaderButtons(),
    ]
  }

  _openMoveSheet(e?: JQuery.ClickEvent) {
    e?.preventDefault()

    if (!this.actor.moveSheet) {
      this.actor.moveSheet ||= new SFCharacterMoveSheet(
        this.actor,
        IronswornSettings.get('toolbox') === 'starforged'
          ? 'starforged'
          : 'ironsworn',
        { left: 755 }
      )
    }
    this.actor.moveSheet.render(true, { focus: true })
  }

  async _onStatRoll(ev: JQuery.ClickEvent) {
    ev.preventDefault()

    const el = ev.currentTarget
    const stat = el.dataset.stat
    if (stat) {
      IronswornPrerollDialog.showForStat(
        stat,
        this.actor.system[stat],
        this.actor
      )
      this.render(true)
    }
  }

  _resourceAdjust(ev: JQuery.ClickEvent) {
    ev.preventDefault()

    const amt = parseInt(ev.currentTarget.dataset.amt || '0')
    const min = parseInt(ev.currentTarget.dataset.min || '-100')
    const max = parseInt(ev.currentTarget.dataset.max || '100')
    const { stat } = ev.currentTarget.dataset
    const actorData = this.actor.system as CharacterDataPropertiesData
    let value = actorData[stat] as number
    value += amt
    if (value >= min && value <= max) {
      this.actor.update({ system: { [stat]: value } })
      if (stat === 'supply' && IronswornSettings.get('shared-supply')) {
        IronswornSettings.updateGlobalAttribute({
          system: { supply: value },
        })
      }
    }
  }

  _momentumBurn(ev: JQuery.ClickEvent) {
    ev.preventDefault()

    if (this.actor.type === 'character') {
      this.actor.burnMomentum()
    }
  }
}
