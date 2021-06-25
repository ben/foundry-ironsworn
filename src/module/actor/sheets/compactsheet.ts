import { IronswornRollDialog } from '../../helpers/roll'
import { IronswornSettings } from '../../helpers/settings'
import { capitalize } from '../../helpers/util'
import { IronswornActor } from '../actor'
import { IronswornCharacterData } from '../actortypes'
import { CharacterMoveSheet } from './charactermovesheet'
import { CharacterSheetOptions } from './charactersheet'

export class IronswornCompactCharacterSheet extends ActorSheet<ActorSheet.Data<IronswornActor>, IronswornActor> {
  constructor(actor, opts) {
    super(actor, opts)

    const actorData = this.actor.data.data as IronswornCharacterData
    actor.update({data: {statRollBonus: actorData.statRollBonus || 0}})
  }

  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ['ironsworn', 'sheet', 'actor', `theme-${IronswornSettings.theme}`],
      width: 600,
      height: 300,
      template: 'systems/foundry-ironsworn/templates/actor/compact.hbs',
      // resizable: false,
    } as CharacterSheetOptions)
  }

  activateListeners(html: JQuery) {
    super.activateListeners(html)

    html.find('.ironsworn__stat__roll').on('click', (e) => this._onStatRoll.call(this, e))
    html.find('.ironsworn__stat__bonusadajust').on('click', (e) => this._bonusAdjust.call(this, e))
  }

  getData() {
    let data: any = super.getData()

    const actorData = this.actor.data.data as IronswornCharacterData
    data.statRollBonus = actorData.statRollBonus || 0

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
      this.actor.moveSheet.render(true, {focus: true} as any) // TODO: fix this cast
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
    const actorData = this.actor.data.data as IronswornCharacterData
    const current = actorData.statRollBonus || 0
    this.actor.update({data: {statRollBonus: current + amt}})
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
}
