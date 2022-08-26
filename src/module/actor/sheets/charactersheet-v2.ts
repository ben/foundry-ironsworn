import { IronswornSettings } from '../../helpers/settings'
import characterSheetVue from '../../vue/character-sheet.vue'
import { VueSheetRenderHelperOptions } from '../../vue/vue-render-helper'
import { VueActorSheet } from '../../vue/vueactorsheet'
import { SFCharacterMoveSheet } from './sf-charactermovesheet'

export class IronswornCharacterSheetV2 extends VueActorSheet {
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      template: 'systems/foundry-ironsworn/templates/actor/character-v2.hbs',
      width: 700,
      height: 800,
      left: 50,
    })
  }

  get renderHelperOptions(): Partial<VueSheetRenderHelperOptions> {
    return {
      components: { 'character-sheet': characterSheetVue },
    }
  }

  render(...args) {
    if (this._state <= Application.RENDER_STATES.NONE) this._openMoveSheet()
    return super.render(...args)
  }

  close(...args) {
    this.actor.moveSheet?.close(...args)
    return super.close(...args)
  }

  _getHeaderButtons() {
    return [
      {
        class: 'ironsworn-toggle-edit-mode',
        label: 'Edit',
        icon: 'fas fa-edit',
        onclick: (e) => this._toggleEditMode(e),
      },
      {
        class: 'ironsworn-open-move-sheet',
        label: 'Moves',
        icon: 'fas fa-directions',
        onclick: (e) => this._openMoveSheet(e),
      },
      ...super._getHeaderButtons(),
    ]
  }

  _toggleEditMode(_e: JQuery.ClickEvent) {
    const currentValue = this.actor.getFlag('foundry-ironsworn', 'edit-mode')
    this.actor.setFlag('foundry-ironsworn', 'edit-mode', !currentValue)
  }

  _openMoveSheet(_e?: JQuery.ClickEvent) {
    if (!this.actor.moveSheet) {
      this.actor.moveSheet ||= new SFCharacterMoveSheet(
        this.actor,
        IronswornSettings.toolbox === 'starforged' ? 'starforged' : 'ironsworn',
        { left: 755 }
      )
    }
    this.actor.moveSheet.render(true, { focus: true })
  }
}
