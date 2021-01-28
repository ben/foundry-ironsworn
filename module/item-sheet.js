import {
  ironswornMoveRoll,
  ironswornRollDialog,
  RANKS,
  RANK_INCREMENTS
} from './ironsworn.js'

/**
 * Extend the basic ItemSheet with some very simple modifications
 * @extends {ItemSheet}
 */
export class IronswornItemSheet extends ItemSheet {
  /** @override */
  static get defaultOptions () {
    return mergeObject(super.defaultOptions, {
      classes: ['ironsworn', 'sheet', 'item'],
      width: 520,
      height: 480
    })
  }

  /* -------------------------------------------- */
  /** @override */
  get template () {
    const path = 'systems/foundry-ironsworn/templates/item'
    return `${path}/${this.item.data.type}.hbs`
  }

  /* -------------------------------------------- */

  /** @override */
  getData () {
    const data = super.getData()

    data.ranks = RANKS

    return data
  }

  /* -------------------------------------------- */

  /** @override */
  setPosition (options = {}) {
    const position = super.setPosition(options)
    const sheetBody = this.element.find('.sheet-body')
    const bodyHeight = position.height - 82
    sheetBody.css('height', bodyHeight)
    return position
  }

  /* -------------------------------------------- */

  /** @override */
  activateListeners (html) {
    super.activateListeners(html)

    // Activate roll links
    html.find('a.inline-roll').on('click', ev => {
      ev.preventDefault()
      const el = ev.currentTarget
      const moveTitle = `${this.object.name} (${el.dataset.param})`
      const actor = this.object.actor || {}
      return ironswornRollDialog(actor.data?.data, el.dataset.param, moveTitle)
    })

    // Everything below here is only needed if the sheet is editable
    if (!this.options.editable) return

    html.find('.delete-field').click(async ev => {
      ev.preventDefault()
      const idx = parseInt(
        $(ev.target)
          .parents('.item-row')
          .data('idx')
      )
      const fields = Object.values(this.item.data.data.fields)
      fields.splice(idx, 1)
      await this.item.update({ 'data.fields': fields })
    })
    html.find('.add-field').click(async ev => {
      const fields = Object.values(this.item.data.data.fields)
      fields.push({ name: '', value: '' })
      await this.item.update({ 'data.fields': fields })
    })

    html.find('.track-target').click(async ev => {
      const newValue = parseInt(ev.currentTarget.dataset.value)
      await this.item.update({ 'data.track.current': newValue })
    })

    // Vow progress buttons
    html.find('.markProgress').click(ev => {
      ev.preventDefault()
      return this.item.markProgress()
    })
    html.find('.fulfillProgress').click(ev => {
      ev.preventDefault()
      return this.item.fulfill()
    })
    html.find('.clearProgress').click(ev => {
      ev.preventDefault()
      return this.item.clearProgress()
    })
    html.find('.delete').click(async ev => {
      ev.preventDefault()
      await Dialog.confirm({
        title: game.i18n.localize('IRONSWORN.DeleteItem'),
        content: `<p>${game.i18n.localize('IRONSWORN.ConfirmDelete')}</p>`,
        yes: () => this.item.delete(),
        defaultYes: false
      })
    })

    // Bonds
    html.find('.add-bond').click(ev => {
      const bonds = Object.values(this.item.data.data.bonds)
      bonds.push({ name: '', notes: '' })
      return this.item.update({ 'data.bonds': bonds })
    })
    html.find('.delete-bond').click(async ev => {
      ev.preventDefault()
      const idx = parseInt(
        $(ev.target)
          .parents('.item-row')
          .data('idx')
      )
      const bonds = Object.values(this.item.data.data.bonds)
      bonds.splice(idx, 1)
      await this.item.update({ 'data.bonds': bonds })
    })
  }

  /* -------------------------------------------- */

  /**
   * Listen for click events on an attribute control to modify the composition of attributes in the sheet
   * @param {MouseEvent} event    The originating left click event
   * @private
   */
  async _onClickAttributeControl (event) {
    event.preventDefault()
    const a = event.currentTarget
    const action = a.dataset.action
    const attrs = this.object.data.data.attributes
    const form = this.form

    // Add new attribute
    if (action === 'create') {
      const nk = Object.keys(attrs).length + 1
      let newKey = document.createElement('div')
      newKey.innerHTML = `<input type="text" name="data.attributes.attr${nk}.key" value="attr${nk}"/>`
      newKey = newKey.children[0]
      form.appendChild(newKey)
      await this._onSubmit(event)
    }

    // Remove existing attribute
    else if (action === 'delete') {
      const li = a.closest('.attribute')
      li.parentElement.removeChild(li)
      await this._onSubmit(event)
    }
  }
}
