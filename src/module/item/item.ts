import { createIronswornChatRoll } from '../chat/chatrollhelpers'
import { RANK_INCREMENTS } from '../constants'
import { EnhancedDataswornMove, moveDataByName } from '../helpers/data'
import { IronswornPrerollDialog } from '../rolls'

/**
 * Extend the base Iteem entity
 * @extends {Item}
 */
export class IronswornItem extends Item {
  /**
   * Progress methods
   */
  markProgress(numMarks = 1) {
    if (this.data.type !== 'vow' && this.data.type !== 'progress') return

    const increment = RANK_INCREMENTS[this.data.data.rank] * numMarks
    let newValue = this.data.data.current + increment
    newValue = Math.min(newValue, 40)
    newValue = Math.max(newValue, 0)
    return this.update({ 'data.current': newValue })
  }

  clearProgress() {
    if (this.data.type !== 'vow' && this.data.type !== 'progress') return
    return this.update({ 'data.current': 0 })
  }

  fulfill() {
    if (this.data.type !== 'progress') return

    const progress = Math.floor(this.data.data.current / 4)
    return IronswornPrerollDialog.showForProgress(
      this.name || '(progress)',
      progress,
      this.actor || undefined,
      this.data.data.subtype === 'vow'
    )
  }

  /**
   * Bondset methods
   */

  async writeEpilogue() {
    if (this.data.type !== 'bondset') return

    const move = await moveDataByName('Write Your Epilogue')
    if (!move) throw new Error('Problem loading write-epilogue move')

    const progress = Math.floor(Object.values(this.data.data.bonds).length / 4)
    const r = new Roll(`{${progress},d10,d10}`)
    createIronswornChatRoll({
      isProgress: true,
      move,
      roll: r,
      actor: this.actor || undefined,
    })
  }

  /**
   * Move methods
   */
  getMoveData(): EnhancedDataswornMove {
    if (this.data.type !== 'move')
      throw new Error(`tried to get move data from a ${this.type}`)
    return {
      Name: this.name || '',
      Source: {
        Name: 'Custom',
        Page: '',
      },
      Stats: this.data.data.stats,
      Text: '',
      Description: this.data.data.description,
      Strong: this.data.data.strong,
      Weak: this.data.data.weak,
      Miss: this.data.data.miss,
    }
  }

  /**
   * Asset methods
   */
  createField() {
    if (this.data.type !== 'asset') return
    const fields = this.data.data.fields
    fields.push({ name: '', value: '' })
    return this.update({ 'data.fields': fields })
  }
  deleteField(name) {
    if (this.data.type !== 'asset') return
    const fields = this.data.data.fields
    return this.update({ 'data.fields': fields.filter((x) => x.name !== name) })
  }
  createAbility() {
    if (this.data.type !== 'asset') return
    const abilities = this.data.data.abilities
    abilities.push({
      enabled: false,
      description: '',
      hasClock: false,
      clockMax: 4,
      clockTicks: 0,
    })
    return this.update({ 'data.abilities': abilities })
  }
  deleteAbility(name) {
    if (this.data.type !== 'asset') return
    const abilities = this.data.data.abilities
    return this.update({
      'data.abilities': abilities.filter((x) => x.name !== name),
    })
  }

  // Bondset methods
  get count() {
    if (this.data.type !== 'bondset') return
    return Object.values(this.data.data.bonds).length
  }
}

declare global {
  interface DocumentClassConfig {
    Item: typeof IronswornItem
  }
}
