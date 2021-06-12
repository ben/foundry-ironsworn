import { IronswornItem } from '../item/item'
import { IronswornActorData } from './actortypes'
import { CharacterMoveSheet } from './sheets/charactermovesheet'

/**
 * Extend the base Actor entity by defining a custom roll data structure which is ideal for the Simple system.
 * @extends {Actor}
 */
export class IronswornActor extends Actor<IronswornActorData, IronswornItem> {
  moveSheet?: CharacterMoveSheet

  /** @override */
  getRollData() {
    const data = super.getRollData()
    return data
  }

  /** @override */
  prepareDerivedData() {
    // Calculate momentum max/reset from debilities
    const data = this.data.data as any
    const numDebilitiesMarked = Object.values(data.debility).filter((x) => x).length
    data.momentumMax = 10 - numDebilitiesMarked
    data.momentumReset = Math.max(0, 2 - numDebilitiesMarked)
  }

  async addDefaultItems() {
    // Every character needs a bondset
    await this.createOwnedItem({ type: 'bondset', name: 'bonds' })
  }
}

Hooks.on('createActor', async (actor) => {
  if (actor.data.type === 'character') {
    await actor.addDefaultItems()
  }
})
