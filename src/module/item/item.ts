import { createIronswornChatRoll } from '../chat/chatrollhelpers'
import { RANK_INCREMENTS } from '../constants'
import { EnhancedDataswornMove, moveDataByName } from '../helpers/data'
import { IronswornPrerollDialog } from '../rolls'

/**
 * Extend the base Item entity
 * @extends {Item}
 */
export class IronswornItem extends Item {
  /**
   * Progress methods
   */
  markProgress(numMarks = 1) {
    if (this.type !== 'vow' && this.type !== 'progress') return

    const increment = RANK_INCREMENTS[this.system.rank] * numMarks
    let newValue = this.system.current + increment
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

    const progress = Math.floor(this.system.current / 4)
    return IronswornPrerollDialog.showForProgress(
      this.name || '(progress)',
      progress,
      this.actor || undefined,
      this.system.subtype === 'vow'
    )
  }

  /**
   * Bondset methods
   */

  async writeEpilogue() {
    if (this.data.type !== 'bondset') return

    const move = await moveDataByName('Write Your Epilogue')
    if (!move) throw new Error('Problem loading write-epilogue move')

    const progress = Math.floor(Object.values(this.system.bonds).length / 4)
    const r = new Roll(`{${progress},d10,d10}`)
    createIronswornChatRoll({
      isProgress: true,
      move,
      roll: r,
      actor: this.actor || undefined,
    })
  }
}

declare global {
  interface DocumentClassConfig {
    Item: typeof IronswornItem
  }
}
