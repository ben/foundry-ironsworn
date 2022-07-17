import { App } from 'vue'
import { $ItemKey } from './provisions'
import {
  VueSheetRenderHelper,
  VueSheetRenderHelperOptions,
} from './vue-render-helper'

export abstract class VueItemSheet extends ItemSheet {
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

  close(options?: FormApplication.CloseOptions | undefined): Promise<void> {
    this.renderHelper?.close()
    return super.close(options)
  }
}
