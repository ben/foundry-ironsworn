import { IronswornItemSheet } from '../item-sheet'
import { DelveDomainDataSource } from '../itemtypes'

export class DelveThemeOrDomainSheet extends IronswornItemSheet {
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      height: 650,
    })
  }

  get themeData(): DelveDomainDataSource {
    return this.item.data as DelveDomainDataSource
  }

  activateListeners(html: JQuery) {
    super.activateListeners(html)

    html.find('.ironsworn__features__description').on('blur', (ev) => this._featureDescription.call(this, ev))
    html.find('.ironsworn__dangers__description').on('blur', (ev) => this._dangerDescription.call(this, ev))
  }

  _featureDescription(ev: JQuery.BlurEvent) {
    const val = $(ev.currentTarget).val()?.toString() || ''
    const idx = parseInt(ev.target.dataset.idx)
    const { features } = this.themeData.data
    features[idx].description = val
    this.item.update({ data: { features } }, { render: false })
  }

  _dangerDescription(ev: JQuery.BlurEvent) {
    const val = $(ev.currentTarget).val()?.toString() || ''
    const idx = parseInt(ev.target.dataset.idx)
    const { dangers } = this.themeData.data
    dangers[idx].description = val
    this.item.update({ data: { dangers } }, { render: false })
  }
}
