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

  protected async _onDrop(event: DragEvent) {
    const data = (TextEditor as any).getDragEventData(event)
    if ((data as any).type === 'AssetBrowserData') {
      const pack = game.packs.get((data as any).pack)
      const document = await pack?.getDocument((data as any).id)
      if (document) {
        this.actor.createEmbeddedDocuments('Item', [
          (document as any).toObject(),
        ])
      }
    }

    return super._onDrop(event)
  }
}
