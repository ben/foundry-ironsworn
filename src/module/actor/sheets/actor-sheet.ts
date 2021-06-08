import { IronswornRollDialog } from '../../helpers/roll'
import { capitalize } from '../../helpers/util'
import { IronswornItem } from '../../item/item'
import { IronswornActor } from '../actor'

/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
export class IronswornActorSheet extends ActorSheet<ActorSheet.Data<IronswornActor>, IronswornActor> {
  /** @override */
  static get defaultOptions () {
    return mergeObject(super.defaultOptions, {
      classes: ['ironsworn', 'sheet', 'actor'],
      width: 1200,
      height: 800,
      dragDrop: [{ dragSelector: '.item-list .item', dropSelector: null }]
    } as BaseEntitySheet.Options)
  }

  /** @override */
  get template () {
    const path = 'systems/foundry-ironsworn/templates/actor'
    return `${path}/${this.actor.data.type}.hbs`
  }

  /* -------------------------------------------- */

  /** @override */
  getData () {
    const data: any = super.getData()

    data.builtInMoves = []
    for (const moveName of MOVES) {
      if (moveName.startsWith('---')) {
        data.builtInMoves.push({
          separator: true,
          title: moveName.substr('--- '.length)
        })
      } else {
        data.builtInMoves.push({
          title: game.i18n.localize(`IRONSWORN.Moves:${moveName}:title`),
          description: game.i18n.localize(`IRONSWORN.Moves:${moveName}:description`),
        })
      }
    }

    data.customMoves = this.actor.items.filter(x => x.type === 'move')

    data.assets = this.actor.items.filter(x => x.type === 'asset')
    data.vows = this.actor.items.filter(x => x.type === 'vow')
    data.progresses = this.actor.items.filter(x => x.type === 'progress')
    data.bonds = this.actor.items.find(x => x.type === 'bondset')

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
    html.find('#edit-stats').click(async _ev => {
      if (this.actor.getFlag('foundry-ironsworn', 'editStats')) {
        await this.actor.unsetFlag('foundry-ironsworn', 'editStats')
      } else {
        await this.actor.setFlag('foundry-ironsworn', 'editStats', 'true')
      }
    })

    // Moves expand in place
    html.find('.built-in-move-entry').click(this._handleBuiltInMoveExpand.bind(this))
    html.find('.move-entry').click(this._handleMoveExpand.bind(this))
    html.find('.asset-entry').click(this._handleAssetExpand.bind(this))

    // Vow/progress buttons
    html.find('.add-item').click(async ev => {
      let el = $(ev.target)
      if (!el.hasClass('add-item')) {
        el = el.parents('.add-item')
      }
      const itemType = el.data('type')
      this.actor.createOwnedItem(
        { type: itemType, name: `New ${itemType}` },
        { renderSheet: true }
      )
    })
    html.find('.markProgress').click(ev => {
      const itemId = $(ev.target)
        .parents('.item-row')
        .data('id')
      const item = this.actor.items.find(x => x.id === itemId) as IronswornItem
      return item?.markProgress()
    })
    html.find('.fulfillProgress').click(ev => {
      const itemId = $(ev.target)
        .parents('.item-row')
        .data('id')
      const item = this.actor.items.find(x => x.id === itemId) as IronswornItem
      return item?.fulfill()
    })
    html.find('.edit-item').click(ev => {
      const itemId = $(ev.target)
        .parents('.item-row')
        .data('id')
      const item = this.actor.items.find(x => x.id === itemId)
      item?.sheet?.render(true)
    })
    html.find('.edit-bonds').click(ev => {
      const itemId = ev.target.dataset.id
      const item = this.actor.items.find(x => x.id === itemId)
      item?.sheet?.render(true)
    })

    // Update Inventory Item
    html.find('.item-edit').click(ev => {
      ev.preventDefault()
      const li = $(ev.currentTarget).parents('.item')
      const item = this.actor.items.get(li.data('itemId'))
      item?.sheet?.render(true)
    })

    // Delete Inventory Item
    html.find('.item-delete').click(ev => {
      ev.preventDefault()
      const li = $(ev.currentTarget).parents('.item')
      this.actor.deleteOwnedItem(li.data('itemId'))
      li.slideUp(200, () => this.render(false))
    })

    // Asset tracks
    html.find('.track-target').click(ev => {
      ev.preventDefault()
      const row = $(ev.currentTarget).parents('.item-row')
      const item = this.actor.items.get(row.data('id'))
      const newValue = parseInt(ev.currentTarget.dataset.value)
      return item?.update({ 'data.track.current': newValue })
    })
    html.find('.item-row').map((_i, el) => {
      const item = this.actor.items.get(el.dataset.id)
      this._attachInlineRollListeners($(el), item)
    })
    html.find('.roll-asset-track').click(ev => {
      const row = $(ev.currentTarget).parents('.item-row')
      const item = this.actor.items.get(row.data('id'))
      const data = {
        ...this.getData(),
        track: (item?.data.data as any).track.current
      }
      IronswornRollDialog.showDialog(data, 'track', `${item?.name}`)
    })
  }

  async _handleBuiltInMoveExpand (ev) {
    ev.preventDefault()
    const li = $(ev.currentTarget).parents('li')
    const summary = li.children('.move-summary')
    if (li.hasClass('expanded')) {
      summary.slideUp(200)
    } else {
      summary.slideDown(200)
    }
    li.toggleClass('expanded')
  }

  async _handleMoveExpand (ev) {
    ev.preventDefault()
    const li = $(ev.currentTarget).parents('li')
    const item = this.actor.items.get(li.data('id'))

    if (li.hasClass('expanded')) {
      const summary = li.children('.move-summary')
      summary.slideUp(200, () => summary.remove())
    } else {
      const content = this._parseRollPlus((item?.data.data as any).description)
      const div = $(`<div class="move-summary">${content}</div>`)
      this._attachInlineRollListeners(div, item)
      li.append(div.hide())
      div.slideDown(200)
    }
    li.toggleClass('expanded')
  }

  async _handleAssetExpand (ev) {
    ev.preventDefault()
    const li = $(ev.currentTarget).parents('li')
    const item = this.actor.items.get(li.data('id'))

    const flagKey = `expanded-${item?.id}`
    const value = this.actor.getFlag('foundry-ironsworn', flagKey)
    this.actor.setFlag('foundry-ironsworn', flagKey, !value)
  }

  _parseRollPlus (text) {
    const rendered = TextEditor.enrichHTML(text)
    return rendered.replace(
      /\(\(rollplus (.*?)\)\)/g,
      `
    <a class='inline-roll' data-param='$1'>
      <i class='fas fa-dice-d6'></i>
      ${game.i18n.localize('IRONSWORN.Roll')} +$1
    </a>`
    )
  }

  _attachInlineRollListeners (html, item) {
    html.find('a.inline-roll').on('click', ev => {
      ev.preventDefault()
      const el = ev.currentTarget
      const moveTitle = `${item?.name || html.data('name')} (${el.dataset.param})`
      const actor = this.actor || {}
      return IronswornRollDialog.showDialog(actor.data?.data, el.dataset.param, moveTitle)
    })
  }

  async _rollStat (event) {
    event.preventDefault()
    const el = event.currentTarget

    const stat = el.dataset.stat
    if (stat) {
      // Clicked a non-edit stat; trigger a roll
      const rollText = game.i18n.localize('IRONSWORN.Roll')
      const statText = game.i18n.localize(`IRONSWORN.${capitalize(stat)}`)
      IronswornRollDialog.showDialog(this.actor.data.data, stat, `${rollText} +${statText}`)
    }

    const resource = el.dataset.resource
    if (resource) {
      // Clicked a value in momentum/health/etc, set the value
      const newValue = parseInt(el.dataset.value)
      const { momentumMax } = (this.actor.data.data as any)
      if (resource !== 'momentum' || newValue <= momentumMax) {
        await this.actor.update({ data: { [resource]: newValue } })
      }
    }

    const tableName = el.dataset.table
    if (tableName) {
      // Clicked an oracle, roll from the table
      let table = game.tables?.find(x => x.name === tableName)
      if (!table) {
        const pack = game.packs?.get('foundry-ironsworn.ironsworntables') as any
        const entry = pack?.index.find(x => x.name == tableName)
        if (entry) table = await pack.getDocument(entry._id)
      }
      if (table) table.draw()
    }
  }

  async _burnMomentum (event) {
    event.preventDefault()

    const { momentum, momentumReset } = (this.actor.data.data as any)
    if (momentum > momentumReset) {
      await this.actor.update({
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
  'Secure An Advantage',
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
