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

    // Moves
    const pack = game.packs.get('foundry-ironsworn.ironswornitems')
    const packIndex = await pack.getIndex()
    for (const itemEntry of packIndex) {
      const item = await pack.getEntity(itemEntry._id)
      if (item.type === 'move') await this.createOwnedItem(item)
    }
  }
}

Hooks.on('createActor', async actor => {
  if (actor.data.type === 'character') {
    await actor.addDefaultItems()
  }
})
