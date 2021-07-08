import { uniq } from 'lodash'
import { IronswornItemSheet } from '../item-sheet'
import { MoveDataSource } from '../itemtypes'

export class MoveSheet extends IronswornItemSheet {
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      height: 600,
    })
  }

  activateListeners(html: JQuery) {
    super.activateListeners(html)

    this._setChecks(html)
    html.find('.ironsworn__move__stat').on('click', ev => this._checked.call(this, ev))
  }

  _checked(ev: JQuery.ClickEvent) {
    ev.preventDefault()
    const stat = ev.currentTarget.dataset.stat
    if (!stat) return

    const data = this.item.data as MoveDataSource
    let stats = data.data.stats
    if ($(ev.currentTarget).prop('checked')) {
      stats = uniq([...data.data.stats, stat])
    } else {
      stats = stats.filter(x => x !== stat)
    }
    this.item.update({data: {stats}})
  }

  _setChecks(html: JQuery) {
    const data = this.item.data as MoveDataSource
    html.find('.ironsworn__move__stat').each((_i, el) => {
      const stat = el.dataset.stat || ''
      $(el).prop('checked', data.data.stats.includes(stat))
    })
  }
}
