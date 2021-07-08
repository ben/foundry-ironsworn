import { IronswornItem } from '../item/item'
import { ActorDataSource } from './actortypes'
import { CharacterMoveSheet } from './sheets/charactermovesheet'

/**
 * Extend the base Actor entity by defining a custom roll data structure which is ideal for the Simple system.
 * @extends {Actor}
 */
export class IronswornActor extends Actor<ActorDataSource, IronswornItem> {
  moveSheet?: CharacterMoveSheet

  /** @override */
  prepareDerivedData() {
    // Calculate momentum max/reset from debilities
    const data = this.data.data as any

    if (this.data.type === 'character') {
      const numDebilitiesMarked = Object.values(data.debility).filter((x) => x).length
      data.momentumMax = 10 - numDebilitiesMarked
      data.momentumReset = Math.max(0, 2 - numDebilitiesMarked)
    }
  }
}

Hooks.on('createActor', async (actor) => {
  await actor.createOwnedItem({ type: 'bondset', name: 'bonds' })
})
