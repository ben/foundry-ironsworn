import { IronswornActor } from '../actor/actor'
import { createIronswornChatRoll } from '../chat/rolls'
import { RANK_INCREMENTS } from '../constants'
import { moveDataByName } from '../helpers/data'
import { AssetItemData, IronswornItemData, ProgressItemData } from './itemtypes'

/**
 * Extend the base Iteem entity
 * @extends {Item}
 */
export class IronswornItem extends Item<IronswornItemData> {
  /**
   * Progress methods
   */
  markProgress() {
    if ((this.data.data as any).rank === undefined) return

    const data = this.data as ProgressItemData
    const increment = RANK_INCREMENTS[data.data.rank]
    const newValue = Math.min(data.data.current + increment, 40)
    return this.update({ 'data.current': newValue })
  }

  clearProgress() {
    if ((this.data.data as any).rank === undefined) return
    return this.update({ 'data.current': 0 })
  }

  fulfill() {
    if ((this.data.data as any).rank === undefined) return
    if (this.data.type === 'vow') return this.fulfillVow()
    const data = this.data as ProgressItemData
    const progress = Math.floor(data.data.current / 4)
    const r = new Roll(`{${progress},d10,d10}`)
    return r.toMessage({
      flavor: `<div class="move-title">${game.i18n.localize('IRONSWORN.ProgressRoll')}: ${this.name}</div>`,
    })
  }

  async fulfillVow() {
    const move = await moveDataByName('Fulfill Your Vow')
    if (!move) throw new Error('Problem loading fulvill-vow move')
    move.Name += `: ${this.data.name}`
    const data = this.data as ProgressItemData
    const progress = Math.floor(data.data.current / 4)
    const r = new Roll(`{${progress},d10,d10}`)
    createIronswornChatRoll({
      actor: this.actor as IronswornActor || undefined,
      move,
      roll: r,
    })
  }

  setRank(rank: string) {
    if ((this.data.data as any).rank === undefined) return
    return this.update({ 'data.rank': rank })
  }

  /**
   * Asset methods
   */
  createField() {
    const data = this.data as AssetItemData
    const fields = data.data.fields
    fields.push({ name: '', value: '' })
    return this.update({ 'data.fields': fields })
  }
  deleteField(name) {
    const data = this.data as AssetItemData
    const fields = data.data.fields
    return this.update({ 'data.fields': fields.filter((x) => x.name !== name) })
  }
  createAbility() {
    const data = this.data as AssetItemData
    const abilities = data.data.abilities
    abilities.push({
      enabled: false,
      description: '',
    })
    return this.update({ 'data.abilities': abilities })
  }
  deleteAbility(name) {
    const data = this.data as AssetItemData
    const abilities = data.data.abilities
    return this.update({
      'data.abilities': abilities.filter((x) => x.name !== name),
    })
  }

  // Bondset methods
  get count() {
    return Object.values((this.data.data as any).bonds).length
  }
}
