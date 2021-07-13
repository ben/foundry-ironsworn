import { CharacterMoveSheet } from './sheets/charactermovesheet'

/**
 * Extend the base Actor entity by defining a custom roll data structure which is ideal for the Simple system.
 * @extends {Actor}
 */
export class IronswornActor extends Actor {
  moveSheet?: CharacterMoveSheet

  static async createDialog(data, _options = {}) {
    if (CONFIG.IRONSWORN.applications.createActorDialog) {
      CONFIG.IRONSWORN.applications.createActorDialog.options.folder = data?.folder
      CONFIG.IRONSWORN.applications.createActorDialog.render(true)
    }
    return undefined
  }

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

  async burnMomentum() {
    if (this.data.type != 'character') return
    const { momentum, momentumReset } = this.data.data
    if (momentum > momentumReset) {
      this.update({
        data: { momentum: momentumReset },
      })
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
