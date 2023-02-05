import { App } from 'vue'
import { IronswornItem } from '../item/item'
import { $ActorKey } from './provisions'
import {
  VueSheetRenderHelper,
  VueSheetRenderHelperOptions,
} from './vue-render-helper'
import { VueAppMixin } from './vueapp.js'

export abstract class VueActorSheet extends VueAppMixin(ActorSheet) {
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

  close(...args) {
    this.actor.moveSheet?.close(...args)
    return super.close(...args)
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
  _getHeaderButtons() {
    return [
      {
        class: 'ironsworn-toggle-edit-mode',
        label: game.i18n.localize('IRONSWORN.Edit'),
        icon: 'fas fa-edit',
        onclick: (e) => this._toggleEditMode(e),
      },
      ...super._getHeaderButtons(),
    ]
  }

  _toggleEditMode(e: JQuery.ClickEvent) {
    e.preventDefault()

    const currentValue = this.actor.getFlag('foundry-ironsworn', 'edit-mode')
    this.actor.setFlag('foundry-ironsworn', 'edit-mode', !currentValue)
  }

  protected async _onDrop(event: DragEvent) {
    const data = (TextEditor as any).getDragEventData(event)

    if (data.type === 'AssetBrowserData') {
      const document = (await fromUuid(data.uuid)) as
        | StoredDocument<IronswornItem>
        | undefined

      if (document) {
        this.actor.createEmbeddedDocuments('Item', [
          (document as any).toObject(),
        ])
      }
    }

    return super._onDrop(event)
  }
}
