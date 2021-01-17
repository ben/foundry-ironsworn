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

    data.vows = this.actor.items.filter(x => x.type === 'vow')
    data.progresses = this.actor.items.filter(x => x.type === 'progress')

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
    html.find('.move-entry').click(this._handleMoveExpand.bind(this))

    // Vow/progress buttons
    html.find('.add-item').click(async ev => {
      const itemType = $(ev.target).data('type')
      this.actor.createOwnedItem(
        { type: itemType, name: `New ${itemType}` },
        { renderSheet: true }
      )
    })
    html.find('.markProgress').click(ev => {
      const itemId = $(ev.target)
        .parents('.item')
        .data('itemid')
      const item = this.actor.items.find(x => x._id === itemId)
      return item.markProgress()
    })
    html.find('.fulfillProgress').click(ev => {
      const itemId = $(ev.target)
        .parents('.item')
        .data('itemid')
      const item = this.actor.items.find(x => x._id === itemId)
      return item.fulfill()
    })
    html.find('.edit-item').click(ev => {
      const itemId = $(ev.target)
        .parents('.item')
        .data('itemid')
      const item = this.actor.items.find(x => x._id === itemId)
      item.sheet.render(true)
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

  async _handleMoveExpand (ev) {
    ev.preventDefault()
    const li = $(ev.currentTarget).parents('li')
    const item = this.actor.getOwnedItem(li.data('id'))

    if (li.hasClass('expanded')) {
      const summary = li.children('.move-summary')
      summary.slideUp(200, () => summary.remove())
    } else {
      const content = this._renderMove(item)
      const div = $(`<div class="move-summary">${content}</div>`)
      this._attachInlineRollListeners(div, item)
      li.append(div.hide())
      div.slideDown(200)
    }
    li.toggleClass('expanded')
  }

  _renderMove (move) {
    const rendered = TextEditor.enrichHTML(move.data.data.description)
    return rendered.replace(
      /\(\(rollplus (.*?)\)\)/g,
      `
    <a class='inline-roll' data-param='$1'>
      <i class='fas fa-dice-d20'></i>
      Roll +$1.
    </a>`
    )
  }

  _attachInlineRollListeners (html, item) {
    html.find('a.inline-roll').on('click', ev => {
      ev.preventDefault()
      const el = ev.currentTarget
      const moveTitle = `${item.name} (${el.dataset.param})`
      const actor = this.actor || {}
      return ironswornRollDialog(actor.data?.data, el.dataset.param, moveTitle)
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
