import { IronswornSettings } from '../../helpers/settings'
import SfCharacterSheet from '../../vue/sf-charactersheet.vue'
import { VueSheetRenderHelperOptions } from '../../vue/vue-render-helper'
import { VueActorSheet } from '../../vue/vueactorsheet'
import { SFCharacterMoveSheet } from './sf-charactermovesheet'

export class StarforgedCharacterSheet extends VueActorSheet {
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      width: 630,
      height: 820,
      left: 50,
    })
  }

  get renderHelperOptions(): Partial<VueSheetRenderHelperOptions> {
    return {
      rootComponent: SfCharacterSheet,
    }
  }

  render(...args) {
    super.render(...args)
    if (this._state <= Application.RENDER_STATES.NONE) this._openMoveSheet()
    return this
  }

  _getHeaderButtons() {
    return [
      {
        class: 'ironsworn-open-move-sheet',
        label: game.i18n.localize('IRONSWORN.ITEMS.TypeMove'),
        icon: 'fas fa-directions',
        onclick: (e) => this._openMoveSheet(e),
      },
      ...super._getHeaderButtons(),
    ]
  }
  _openMoveSheet(_e?: JQuery.ClickEvent) {
    this.actor.moveSheet ||= new SFCharacterMoveSheet(
      this.actor,
      IronswornSettings.get('toolbox') === 'ironsworn'
        ? 'ironsworn'
        : 'starforged'
    )
    this.actor.moveSheet.render(true, { focus: true })
  }
}
