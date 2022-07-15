import { merge } from 'lodash'
import {
  VueSheetRenderHelper,
  VueSheetRenderHelperOptions,
} from './vue-render-helper'

export abstract class VueActorSheet extends ActorSheet {
  renderHelper: VueSheetRenderHelper | undefined

  abstract get renderHelperOptions(): Partial<VueSheetRenderHelperOptions>

  static get defaultOptions(): ActorSheet.Options {
    return mergeObject(super.defaultOptions, {
      classes: ['ironsworn', 'actor'],
    })
  }

  render(
    force?: boolean | undefined,
    options?: Application.RenderOptions<ActorSheet.Options> | undefined
  ): this {
    this.renderHelper ||= new VueSheetRenderHelper(
      this,
      merge(
        {
          provides: { $actor: this.actor },
          vueData: () => ({ actor: this.actor.toObject() }),
        },
        this.renderHelperOptions
      )
    )

    this.renderHelper.render(true, options)
    this.object.apps[this.appId] = this
    return this
  }

  close(options?: FormApplication.CloseOptions | undefined): Promise<void> {
    this.renderHelper?.close()
    return super.close(options)
  }
}
