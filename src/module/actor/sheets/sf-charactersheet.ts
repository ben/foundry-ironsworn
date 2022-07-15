import { Component, ComputedOptions, MethodOptions } from 'vue'
import { IronswornSettings } from '../../helpers/settings'
import SfCharacterSheet from '../../vue/sf-charactersheet.vue'
import { VueActorApp } from '../../vue/vueactorapp'
import { CharacterMoveSheet } from './charactermovesheet'
import { SFCharacterMoveSheet } from './sf-charactermovesheet'

export class StarforgedCharacterSheet extends VueActorApp {
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      template: 'systems/foundry-ironsworn/templates/actor/sf-character.hbs',
      width: 630,
      height: 820,
      left: 50,
    })
  }

  getComponents(): {
    [k: string]: Component<any, any, any, ComputedOptions, MethodOptions>
  } {
    return { 'sf-charactersheet': SfCharacterSheet }
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
    if (IronswornSettings.toolbox === 'ironsworn') {
      new CharacterMoveSheet(this.actor).render(true)
    } else {
      this.actor.moveSheet ||= new SFCharacterMoveSheet(this.actor)
      this.actor.moveSheet.render(true, { focus: true })
    }
  }
}
