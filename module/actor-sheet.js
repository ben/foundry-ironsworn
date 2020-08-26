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
    data.dtypes = ['String', 'Number', 'Boolean']
    data.moves = MOVES
    data.moveOrder = MOVE_ORDER
    return data
  }

  /* -------------------------------------------- */

  /** @override */
  activateListeners (html) {
    super.activateListeners(html)

    // Everything below here is only needed if the sheet is editable
    if (!this.options.editable) return

    // Enable rolling stats
    html.find('.clickable').click(this._rollStat.bind(this))

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
      ironswornRollDialog(this.actor.data.data, stat, `Rolling +${stat}`)
    }

    const tableName = el.dataset.table
    if (tableName) {
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
}

const MOVE_ORDER = ['faceDanger', 'secureAdvantage']
const MOVES = {
  faceDanger: {
    title: 'Face Danger',
    stats: [
      { title: 'Edge', stat: 'edge' },
      { title: 'Heart', stat: 'heart' },
      { title: 'Iron', stat: 'iron' },
      { title: 'Shadow', stat: 'shadow' },
      { title: 'Wits', stat: 'wits' },
      { title: "God's Stat (Devotant)", asset: 'Devotant' },
      { title: 'Essence (Invoke)', asset: 'Invoke' }
    ]
  },
  secureAdvantage: {
    title: 'Secure an Advantage',
    stats: [
      { title: 'Edge', stat: 'edge' },
      { title: 'Heart', stat: 'heart' },
      { title: 'Iron', stat: 'iron' },
      { title: 'Shadow', stat: 'shadow' },
      { title: 'Wits', stat: 'wits' },
      { title: 'Essence (Invoke)', asset: 'Invoke' }
    ]
  }
}
