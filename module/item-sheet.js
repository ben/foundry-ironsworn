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
    // data.dtypes = ['String', 'Number', 'Boolean']
    // for (let attr of Object.values(data.data.attributes)) {
    //   attr.isCheckbox = attr.dtype === 'Boolean'
    // }

    if (this.item.type === 'vow') {
      data.ranks = RANKS
    }

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

    html.find('.remove-option').click(async ev => {
      ev.preventDefault()

      const key = parseInt(ev.currentTarget.dataset.key)
      const itemToRemove = this.item.data.data.options[key]
      let newOptions = Object.values(this.item.data.data.options)
      newOptions = newOptions.filter(x => x !== itemToRemove)
      this.item.update({ data: { options: newOptions } })
    })

    html.find('.addOption').click(async ev => {
      ev.preventDefault()

      const options = Object.values(this.item.data.data.options || [])
      options.push({ description: '', param: 'edge' })
      await this.item.update({ data: { options } })
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

  /* -------------------------------------------- */

  /** @override */
  //   _updateObject (event, formData) {
  //     // Handle the free-form attributes list
  //     const formAttrs = expandObject(formData).data.attributes || {}
  //     const attributes = Object.values(formAttrs).reduce((obj, v) => {
  //       let k = v['key'].trim()
  //       if (/[\s\.]/.test(k))
  //         return ui.notifications.error(
  //           'Attribute keys may not contain spaces or periods'
  //         )
  //       delete v['key']
  //       obj[k] = v
  //       return obj
  //     }, {})

  //     // Remove attributes which are no longer used
  //     for (let k of Object.keys(this.object.data.data.attributes)) {
  //       if (!attributes.hasOwnProperty(k)) attributes[`-=${k}`] = null
  //     }

  //     // Re-combine formData
  //     formData = Object.entries(formData)
  //       .filter(e => !e[0].startsWith('data.attributes'))
  //       .reduce(
  //         (obj, e) => {
  //           obj[e[0]] = e[1]
  //           return obj
  //         },
  //         { _id: this.object._id, 'data.attributes': attributes }
  //       )

  //     // Update the Item
  //     return this.object.update(formData)
  //   }
}
