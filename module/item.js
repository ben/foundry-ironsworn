import { RANKS, RANK_INCREMENTS } from './ironsworn.js'

/**
 * Extend the base Iteem entity
 * @extends {Item}
 */
export class IronswornItem extends Item {
  markProgress () {
    if (this.data.data.rank === undefined) return

    const increment = RANK_INCREMENTS[this.data.data.rank]
    const newValue = Math.min(this.data.data.current + increment, 40)
    return this.update({ 'data.current': newValue })
  }

  clearProgress() {
    if (this.data.data.rank === undefined) return
    return this.update({ 'data.current': 0 })
  }

  fulfill () {
    if (this.data.data.rank === undefined) return
    const progress = Math.floor(this.data.data.current / 4)
    const r = new Roll(`{${progress},d10,d10}`).roll()
    r.toMessage({
      flavor: `<div class="move-title">Fulfill Vow: ${this.name}</div>`
    })
  }
}
