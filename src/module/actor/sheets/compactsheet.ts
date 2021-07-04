import { RollDialog } from '../../helpers/roll'
import { IronswornSettings } from '../../helpers/settings'
import { IronswornActor } from '../actor'
import { IronswornCharacterData } from '../actortypes'
import { CharacterMoveSheet } from './charactermovesheet'
import { CharacterSheetOptions } from './charactersheet'

export interface CompactCharacterSheetOptions extends BaseEntitySheet.Options {
  statRollBonus: number
}


export class IronswornCompactCharacterSheet extends ActorSheet<ActorSheet.Data<IronswornActor>, IronswornActor, CompactCharacterSheetOptions> {
  constructor(actor, opts: CompactCharacterSheetOptions) {
    opts.statRollBonus ||= 0
    super(actor, opts)
  }

  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ['ironsworn', 'sheet', 'actor', `theme-${IronswornSettings.theme}`],
      width: 560,
      height: 228,
      template: 'systems/foundry-ironsworn/templates/actor/compact.hbs',
      resizable: false,
    } as CharacterSheetOptions)
  }

  activateListeners(html: JQuery) {
    super.activateListeners(html)

    html.find('.ironsworn__stat__roll').on('click', (e) => this._onStatRoll.call(this, e))
    html.find('.ironsworn__stat__bonusadajust').on('click', (e) => this._bonusAdjust.call(this, e))
    html.find('.ironsworn__resource__adjust').on('click', (e) => this._resourceAdjust.call(this, e))
    html.find('.ironsworn__momentum__burn').on('click', (e) => this._momentumBurn.call(this, e))
  }

  getData() {
    let data: any = super.getData()

    // Allow every itemtype to add data to the actorsheet
    for (const itemType of CONFIG.IRONSWORN.itemClasses) {
      data = itemType.getActorSheetData(data, this)
    }

    return data
  }

  _getHeaderButtons() {
    return [
      {
        class: 'ironsworn-open-move-sheet',
        label: 'Moves',
        icon: 'fas fa-directions',
        onclick: (e) => this._openMoveSheet(e),
      },
      ...super._getHeaderButtons(),
    ]
  }

  _openMoveSheet(e?: JQuery.ClickEvent) {
    e?.preventDefault()

    if (this.actor.moveSheet) {
      this.actor.moveSheet.render(true, { focus: true } as any) // TODO: fix this cast
    } else {
      new CharacterMoveSheet(this.actor).render(true)
    }
  }

  _onBurnMomentum(ev: JQuery.ClickEvent) {
    ev.preventDefault()

    const { momentum, momentumReset } = this.actor.data.data as IronswornCharacterData
    if (momentum > momentumReset) {
      this.actor.update({
        data: { momentum: momentumReset },
      })
    }
  }

  _bonusAdjust(ev: JQuery.ClickEvent) {
    ev.preventDefault()

    const amt = parseInt(ev.currentTarget.dataset.amt || '0')
    this.options.statRollBonus += amt
    this.render(true)
  }

  async _onStatRoll(ev: JQuery.ClickEvent) {
    ev.preventDefault()

    const el = ev.currentTarget
    const stat = el.dataset.stat
    if (stat) {
      const bonus = this.options.statRollBonus || 0
      await RollDialog.show({
        actor: this.actor,
        stat,
        bonus
      })
      this.options.statRollBonus = 0
      this.render(true)
    }
  }

  _resourceAdjust(ev: JQuery.ClickEvent) {
    ev.preventDefault()

    const amt = parseInt(ev.currentTarget.dataset.amt || '0')
    const min = parseInt(ev.currentTarget.dataset.min || '-100')
    const max = parseInt(ev.currentTarget.dataset.max || '100')
    const { stat } = ev.currentTarget.dataset
    const actorData = this.actor.data.data as IronswornCharacterData
    let value = actorData[stat]
    value += amt
    if (value >= min && value <= max) {
      this.actor.update({ data: { [stat]: value } })
      if (stat === 'supply') {
        IronswornSettings.maybeSetGlobalSupply(value)
      }
    }
  }

  _momentumBurn(ev: JQuery.ClickEvent) {
    ev.preventDefault()

    const { momentum, momentumReset } = this.actor.data.data as IronswornCharacterData
    if (momentum > momentumReset) {
      this.actor.update({
        data: { momentum: momentumReset },
      })
    }
  }
}
