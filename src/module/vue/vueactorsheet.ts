import { App } from 'vue'
import { $ActorKey } from './provisions'
import {
  VueSheetRenderHelper,
  VueSheetRenderHelperOptions,
} from './vue-render-helper'

export abstract class VueActorSheet extends ActorSheet {
  renderHelper: VueSheetRenderHelper | undefined

  static get defaultOptions(): ActorSheet.Options {
    return mergeObject(super.defaultOptions, {
      classes: ['ironsworn', 'actor'],
    })
  }

  abstract get renderHelperOptions(): Partial<VueSheetRenderHelperOptions>

  setupVueApp(app: App) {
    app.provide($ActorKey, this.actor)
  }

  render(
    force?: boolean | undefined,
    options?: Application.RenderOptions<ActorSheet.Options> | undefined
  ): this {
    this.renderHelper ||= new VueSheetRenderHelper(
      this,
      {
        vueData: async () => ({ actor: this.actor.toObject() }),
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
