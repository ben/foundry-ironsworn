/**
 * Extend the base Actor entity by defining a custom roll data structure which is ideal for the Simple system.
 * @extends {Actor}
 */
export class IronswornActor extends Actor {
  /** @override */
  getRollData () {
    const data = super.getRollData()
    return data
  }

  /** @override */
  prepareDerivedData () {
    // Calculate momentum max/reset from debilities
    const numDebilitiesMarked = Object.values(this.data.data.debility).filter(
      x => x
    ).length
    this.data.data.momentumMax = 10 - numDebilitiesMarked
    this.data.data.momentumReset = Math.max(0, 2 - numDebilitiesMarked)
  }

  async addDefaultItems () {
    // Every character needs a bondset
    await this.createOwnedItem({ type: 'bondset', name: 'bonds' })
  }
}

Hooks.on('createActor', async actor => {
  if (actor.data.type === 'character') {
    await actor.addDefaultItems()
  }
})
