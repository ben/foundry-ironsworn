import { App } from 'vue'
import { $ItemKey } from './provisions'
import { VueAppMixin } from './vueapp.js'
import {
  VueSheetRenderHelper,
  VueSheetRenderHelperOptions,
} from './vue-render-helper'

export abstract class VueItemSheet extends VueAppMixin(ItemSheet) {
  renderHelper: VueSheetRenderHelper | undefined

  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ['ironsworn', 'item'],
      width: 520,
      height: 480,
    })
  }

  abstract get renderHelperOptions(): Partial<VueSheetRenderHelperOptions>

  setupVueApp(app: App) {
    app.provide($ItemKey, this.item)
  }

  render(
    force?: boolean | undefined,
    options?: Application.RenderOptions<DocumentSheetOptions> | undefined
  ): this {
    this.renderHelper ||= new VueSheetRenderHelper(
      this,
      {
        vueData: async () => ({ item: this.item.toObject() }),
        ...this.renderHelperOptions,
      },
      this.setupVueApp.bind(this)
    )

    this.renderHelper.render(force, options)
    return this
  }

  get hasEditMode() {
    return true
  }
  _getHeaderButtons() {
    if (this.hasEditMode) {
      return [
        {
          class: 'ironsworn-toggle-edit-mode',
          label: 'Edit',
          icon: 'fas fa-edit',
          onclick: (e) => this._toggleEditMode(e),
        },
        ...super._getHeaderButtons(),
      ]
    }
    return super._getHeaderButtons()
  }
  _toggleEditMode(_e: JQuery.ClickEvent) {
    const currentValue = this.item.getFlag('foundry-ironsworn', 'edit-mode')
    this.item.setFlag('foundry-ironsworn', 'edit-mode', !currentValue)
  }
}
