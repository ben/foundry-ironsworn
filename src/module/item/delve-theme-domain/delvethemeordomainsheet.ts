import { IronswornItemSheet } from '../item-sheet'
import { DelveDomainDataPropertiesData } from '../itemtypes'

export class DelveThemeOrDomainSheet extends IronswornItemSheet {
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      height: 650,
    })
  }

  get themeData(): DelveDomainDataPropertiesData {
    return this.item.system as DelveDomainDataPropertiesData
  }

  activateListeners(html: JQuery) {
    super.activateListeners(html)

    html
      .find('.ironsworn__features__description')
      .on('blur', (ev) => this._featureDescription.call(this, ev))
    html
      .find('.ironsworn__dangers__description')
      .on('blur', (ev) => this._dangerDescription.call(this, ev))
  }

  _featureDescription(ev: JQuery.BlurEvent) {
    const val = $(ev.currentTarget).val()?.toString() || ''
    const idx = parseInt(ev.target.dataset.idx)
    const { features } = this.themeData
    features[idx].description = val
    this.item.update({ system: { features } }, { render: false })
  }

  _dangerDescription(ev: JQuery.BlurEvent) {
    const val = $(ev.currentTarget).val()?.toString() || ''
    const idx = parseInt(ev.target.dataset.idx)
    const { dangers } = this.themeData
    dangers[idx].description = val
    this.item.update({ system: { dangers } }, { render: false })
  }
}
