import { uniq } from 'lodash'
import { IronswornItemSheet } from '../item-sheet'

export class MoveSheet extends IronswornItemSheet {
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      height: 600,
    })
  }

  activateListeners(html: JQuery) {
    super.activateListeners(html)

    this._setChecks(html)
    html
      .find('.ironsworn__move__stat')
      .on('click', (ev) => this._checked.call(this, ev))
  }

  _checked(ev: JQuery.ClickEvent) {
    ev.preventDefault()
    const stat = ev.currentTarget.dataset.stat
    if (!stat) return

    if (this.item.data.type !== 'move') return
    let stats = this.item.data.data.stats
    if ($(ev.currentTarget).prop('checked')) {
      stats = uniq([...this.item.data.data.stats, stat])
    } else {
      stats = stats.filter((x) => x !== stat)
    }
    this.item.update({ data: { stats } })
  }

  _setChecks(html: JQuery) {
    html.find('.ironsworn__move__stat').each((_i, el) => {
      if (this.item.data.type !== 'move') return
      const stat = el.dataset.stat || ''
      $(el).prop('checked', this.item.data.data.stats.includes(stat))
    })
  }
}
