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
      .find('[data-on-blur="ironsworn:updateFeatureText"]')
      .on('blur', (ev) => this._updateFeatureText.call(this, ev))
    html
      .find('[data-on-blur="ironsworn:updateDangerText"]')
      .on('blur', (ev) => this._updateDangerText.call(this, ev))
  }

  _updateFeatureText(ev: JQuery.BlurEvent) {
    const val = $(ev.currentTarget).val()?.toString() || ''
    const idx = parseInt(ev.target.dataset.idx)
    const { features } = this.themeData
    features[idx].description = val
    this.item.update({ system: { features } }, { render: false })
  }

  _updateDangerText(ev: JQuery.BlurEvent) {
    const val = $(ev.currentTarget).val()?.toString() || ''
    const idx = parseInt(ev.target.dataset.idx)
    const { dangers } = this.themeData
    dangers[idx].description = val
    this.item.update({ system: { dangers } }, { render: false })
  }
}
