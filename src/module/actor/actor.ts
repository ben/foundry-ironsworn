import { CharacterMoveSheet } from './sheets/charactermovesheet'

/**
 * Extend the base Actor entity by defining a custom roll data structure which is ideal for the Simple system.
 * @extends {Actor}
 */
export class IronswornActor extends Actor {
  moveSheet?: CharacterMoveSheet

  /** @override */
  prepareDerivedData() {
    // Calculate momentum max/reset from debilities
    if (this.data.type === 'character') {
      const data = this.data.data
      const numDebilitiesMarked = Object.values(data.debility).filter((x) => x).length
      data.momentumMax = 10 - numDebilitiesMarked
      data.momentumReset = Math.max(0, 2 - numDebilitiesMarked)
    }
  }
}

declare global {
  interface DocumentClassConfig {
    Actor: typeof IronswornActor
  }
}

Hooks.on('createActor', async (actor) => {
  await actor.createOwnedItem({ type: 'bondset', name: 'bonds' })
})
