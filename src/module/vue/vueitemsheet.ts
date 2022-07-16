// import Vue from 'vue'
import { merge } from 'lodash'
import { IronswornSettings } from '../helpers/settings'
import { IronswornItem } from '../item/item'
import {
  VueSheetRenderHelper,
  VueSheetRenderHelperOptions,
} from './vue-render-helper'

export abstract class VueItemSheet extends ItemSheet {
  renderHelper: VueSheetRenderHelper | undefined

  abstract get renderHelperOptions(): Partial<VueSheetRenderHelperOptions>

  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ['ironsworn', 'item'],
      width: 520,
      height: 480,
    })
  }

  render(
    force?: boolean | undefined,
    options?: Application.RenderOptions<DocumentSheetOptions> | undefined
  ): this {
    this.renderHelper ||= new VueSheetRenderHelper(
      this,
      merge(
        {
          provides: { $item: this.item },
          vueData: () => ({ item: this.item.toObject() }),
        },
        this.renderHelperOptions
      )
    )

    this.renderHelper.render(force, options)
    return this
  }
}
