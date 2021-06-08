import { RANK_INCREMENTS } from '../constants'
import { IronswornItemData } from './itemtypes'

/**
 * Extend the base Iteem entity
 * @extends {Item}
 */
export class IronswornItem extends Item<IronswornItemData> {
  /**
   * Progress methods
   */
  markProgress () {
    if ((this.data.data as any).rank === undefined) return

    const increment = RANK_INCREMENTS[(this.data.data as any).rank]
    const newValue = Math.min((this.data.data as any).current + increment, 40)
    return this.update({ 'data.current': newValue })
  }

  clearProgress () {
    if ((this.data.data as any).rank === undefined) return
    return this.update({ 'data.current': 0 })
  }

  fulfill () {
    if ((this.data.data as any).rank === undefined) return
    const progress = Math.floor((this.data.data as any).current / 4)
    const r = new Roll(`{${progress},d10,d10}`).roll()
    const i18nKey = this.type === 'vow' ? 'IRONSWORN.FulfillVow' : 'IRONSWORN.ProgressRoll'
    r.toMessage({
      flavor: `<div class="move-title">${game.i18n.localize(i18nKey)}: ${this.name}</div>`
    })
  }

  /**
   * Asset methods
   */
  createField () {
    const fields = (this.data.data as any).fields
    fields.push({ name: '', value: '' })
    return this.update({ 'data.fields': fields })
  }
  deleteField (name) {
    const fields = (this.data.data as any).fields
    return this.update({ 'data.fields': fields.filter(x => x.name !== name) })
  }
  createAbility () {
    const abilities = (this.data.data as any).abilities
    abilities.push({
      enabled: false,
      description: ''
    })
    return this.update({ 'data.abilities': abilities })
  }
  deleteAbility (name) {
    const abilities = (this.data.data as any).abilities
    return this.update({
      'data.abilities': abilities.filter(x => x.name !== name)
    })
  }

  // Bondset methods
  get count() {
    return Object.values((this.data.data as any).bonds).length
  }
}
