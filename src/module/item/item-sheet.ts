import { RANKS } from '../constants'
import { IronswornSettings } from '../helpers/settings'
/**
 * Extend the basic ItemSheet with some very simple modifications
 * @extends {ItemSheet}
 */
export class IronswornItemSheet extends ItemSheet {
  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ['ironsworn', 'sheet', 'item', `theme-${IronswornSettings.theme}`],
      width: 520,
      height: 480,
    })
  }

  /* -------------------------------------------- */
  /** @override */
  get template() {
    const path = 'systems/foundry-ironsworn/templates/item'
    return `${path}/${this.item.data.type}.hbs`
  }

  /* -------------------------------------------- */

  /** @override */
  getData() {
    const data: any = super.getData()

    data.ranks = RANKS

    return data
  }

  /* -------------------------------------------- */

  /** @override */
  setPosition(options = {}) {
    const position = super.setPosition(options)
    const sheetBody = this.element.find('.sheet-body')
    const bodyHeight = (position?.height || 0) - 82
    sheetBody.css('height', bodyHeight)
    return position
  }

  /* -------------------------------------------- */

  /** @override */
  activateListeners(html) {
    super.activateListeners(html)

    // Everything below here is only needed if the sheet is editable
    if (!this.options.editable) return

    html.find('.track-target').click(async (ev) => {
      const newValue = parseInt(ev.currentTarget.dataset.value)
      await this.item.update({ 'data.track.current': newValue })
    })

    // Bonds
    html.find('.add-bond').click((ev) => {
      ev.preventDefault()
      if (this.item.data.type === 'bondset') {
        const bonds = Object.values(this.item.data.data.bonds)
        bonds.push({ name: '', notes: '' })
        this.item.update({ 'data.bonds': bonds })
      }
    })
    html.find('.delete-bond').click(async (ev) => {
      ev.preventDefault()
      if (this.item.data.type === 'bondset') {
        const idx = parseInt($(ev.target).parents('.item-row').data('idx'))
        const bonds = Object.values(this.item.data.data.bonds)
        bonds.splice(idx, 1)
        this.item.update({ data: { bonds } })
      }
    })
  }
}
