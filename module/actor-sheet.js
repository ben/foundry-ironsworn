import { ironswornRollDialog } from './ironsworn.js'

/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
export class IronswornActorSheet extends ActorSheet {
  /** @override */
  static get defaultOptions () {
    return mergeObject(super.defaultOptions, {
      classes: ['ironsworn', 'sheet', 'actor'],
      width: 1200,
      height: 800,
      tabs: [
        {
          navSelector: '.sheet-tabs',
          contentSelector: '.sheet-body',
          initial: 'description'
        }
      ],
      dragDrop: [{ dragSelector: '.item-list .item', dropSelector: null }]
    })
  }

  /** @override */
  get template () {
    const path = 'systems/foundry-ironsworn/templates/actor'
    return `${path}/${this.actor.data.type}.hbs`
  }

  /* -------------------------------------------- */

  /** @override */
  getData () {
    const data = super.getData()

    data.movesForDisplay = []
    for (const moveName of MOVES) {
      if (moveName.startsWith('---')) {
        data.movesForDisplay.push({
          separator: true,
          title: moveName.substr('--- '.length)
        })
      } else {
        const move = this.actor.items.find(
          x => x.type === 'move' && x.name === moveName
        )
        if (move) data.movesForDisplay.push(move)
      }
    }

    return data
  }

  /* -------------------------------------------- */

  /** @override */
  activateListeners (html) {
    super.activateListeners(html)

    // Everything below here is only needed if the sheet is editable
    if (!this.options.editable) return

    // Handle most clickables
    html.find('.clickable').click(this._rollStat.bind(this))

    html.find('#burn').click(this._burnMomentum.bind(this))

    // Enable editing stats
    html.find('#edit-stats').click(async ev => {
      if (this.actor.getFlag('foundry-ironsworn', 'editStats')) {
        await this.actor.unsetFlag('foundry-ironsworn', 'editStats')
      } else {
        await this.actor.setFlag('foundry-ironsworn', 'editStats', 'true')
      }
    })

    // Moves expand in place
    html.find('.move-entry').click(ev => {
      const li = $(ev.currentTarget)
      const move = MOVES[li.data('move')]
      const journalName = `Move: ${move.title}`
      const entry = game.journal.entities.find(x => x.name === journalName)

      if (li.hasClass('expanded')) {
        const summary = li.children('.move-summary')
        summary.slideUp(200, () => summary.remove())
      } else {
        const div = $(`<div class="move-summary">${entry.data.content}</div>`)
        li.append(div.hide())
        div.slideDown(200)
      }
      li.toggleClass('expanded')
    })

    // Update Inventory Item
    html.find('.item-edit').click(ev => {
      const li = $(ev.currentTarget).parents('.item')
      const item = this.actor.getOwnedItem(li.data('itemId'))
      item.sheet.render(true)
    })

    // Delete Inventory Item
    html.find('.item-delete').click(ev => {
      const li = $(ev.currentTarget).parents('.item')
      this.actor.deleteOwnedItem(li.data('itemId'))
      li.slideUp(200, () => this.render(false))
    })
  }

  async _rollStat (event) {
    event.preventDefault()
    const el = event.currentTarget

    const stat = el.dataset.stat
    if (stat) {
      // Clicked a non-edit stat; trigger a roll
      ironswornRollDialog(this.actor.data.data, stat, `Roll +${stat}`)
    }

    const resource = el.dataset.resource
    if (resource) {
      // Clicked a value in momentum/health/etc, set the value
      const newValue = parseInt(el.dataset.value)
      const { momentumMax } = this.actor.data.data
      if (newValue <= momentumMax) {
        await this.actor.update({ data: { [resource]: newValue } })
      }
    }

    const tableName = el.dataset.table
    if (tableName) {
      // Clicked an oracle, roll from the table
      let table = game.tables.find(x => x.name === tableName)
      if (!table) {
        const pack = game.packs.get('foundry-ironsworn.ironsworntables')
        const index = await pack.getIndex()
        const entry = index.find(x => x.name == tableName)
        if (entry) table = await pack.getEntity(entry._id)
      }
      console.log({ table })
      if (table) table.draw()
    }
  }

  async _rollDialog (key) {
    const move = MOVES[key]
    const html = await renderTemplate(
      'systems/foundry-ironsworn/templates/move-dialog.hbs',
      move
    )

    new Dialog({
      title: move.title,
      content: html,
      buttons: {
        roll: {
          icon: '<i class="roll die d10"></i>',
          label: 'Roll',
          callback: function () {
            console.log(this, 'Chose One')
          }
        }
      }
    }).render(true)
  }

  async _burnMomentum (event) {
    event.preventDefault()

    const { momentum, momentumReset } = this.actor.data.data
    if (momentum > momentumReset) {
      await this.actor.update({
        _id: this.actor.id,
        data: { momentum: momentumReset }
      })
    }
  }
}

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
