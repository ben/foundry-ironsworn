/**
 * Extend the base Actor entity by defining a custom roll data structure which is ideal for the Simple system.
 * @extends {Actor}
 */
export class IronswornActor extends Actor {
  /** @override */
  getRollData () {
    const data = super.getRollData()
    const shorthand = game.settings.get('ironsworn', 'macroShorthand')

    // Re-map all attributes onto the base roll data
    if (!!shorthand) {
      for (let [k, v] of Object.entries(data.attributes)) {
        if (!(k in data)) data[k] = v.value
      }
      delete data.attributes
    }

    // Map all items data using their slugified names
    data.items = this.data.items.reduce((obj, i) => {
      let key = i.name.slugify({ strict: true })
      let itemData = duplicate(i.data)
      if (!!shorthand) {
        for (let [k, v] of Object.entries(itemData.attributes)) {
          if (!(k in itemData)) itemData[k] = v.value
        }
        delete itemData['attributes']
      }
      obj[key] = itemData
      return obj
    }, {})
    return data
  }

  /** @override */
  prepareDerivedData () {
    this.data.movesForDisplay = []
    for (const moveName of MOVES) {
      if (moveName.startsWith('---')) {
        this.data.movesForDisplay.push({
          separator: true,
          title: moveName.substr('--- '.length)
        })
      } else {
        const move = this.items.find(
          x => x.type === 'move' && x.name === moveName
        )
        if (move) this.data.movesForDisplay.push(move)
      }
    }
  }

  async addDefaultMoves () {
    const pack = game.packs.get('foundry-ironsworn.ironswornitems')
    const packIndex = await pack.getIndex()

    for (const name of MOVES.filter(x => !x.startsWith('---'))) {
      const itemEntry = packIndex.find(x => x.name === name)
      if (itemEntry) {
        const item = await pack.getEntity(itemEntry._id)
        await this.createOwnedItem(item)
      }
    }
  }
}

Hooks.on('createActor', async actor => {
  if (actor.data.type === 'character') {
    await actor.addDefaultMoves()
  }
})

const MOVES = [
  '--- Fate',
  'Pay the Price',
  'Ask the Oracle',
  '--- Combat',
  'Enter the Fray',
  'Strike',
  'Clash',
  'Turn the Tide',
  'End the Fight',
  'Battle',
  '--- Adventure',
  'Face Danger',
  'Secure an Advantage',
  'Gather Information',
  'Heal',
  'Resupply',
  'Make Camp',
  'Undertake a Journey',
  'Reach Your Destination',
  '--- Relationship',
  'Compel',
  'Sojourn',
  'Draw the Circle',
  'Forge a Bond',
  'Test Your Bond',
  'Aid Your Ally',
  'Write Your Epilogue',
  '--- Quest',
  'Swear an Iron Vow',
  'Reach a Milestone',
  'Fulfill Your Vow',
  'Forsake Your Vow',
  'Advance',
  '--- Suffer',
  'Endure Harm',
  'Endure Stress',
  'Companion Endure Harm',
  'Face Death',
  'Face Desolation',
  'Out of Supply',
  'Face a Setback'
]
