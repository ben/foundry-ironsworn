import { IronswornSettings } from '../../helpers/settings'
import { VueActorSheet } from '../../vue/vueactorsheet'
import { CharacterMoveSheet } from './charactermovesheet'
import { SFCharacterMoveSheet } from './sf-charactermovesheet'

export class IronswornCharacterSheetV2 extends VueActorSheet {
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: [
        'ironsworn',
        'sheet',
        'actor',
        `theme-${IronswornSettings.theme}`,
      ],
      width: 700,
      height: 800,
      left: 50,
      submitOnClose: true,
      submitOnChange: true,
      template: 'systems/foundry-ironsworn/templates/actor/character-v2.hbs',
    })
  }

  getData() {
    let data: any = super.getData()

    // Allow every itemtype to add data to the actorsheet
    for (const itemType of CONFIG.IRONSWORN.itemClasses) {
      data = itemType.getActorSheetData(data, this)
    }

    data.actor = this.actor.toObject(false)
    data.data = data.actor.data

    return data
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
    if (this.actor.moveSheet) {
      this.actor.moveSheet.render(true, { focus: true })
    } else {
      if (IronswornSettings.toolbox === 'starforged') {
        this.actor.moveSheet ||= new SFCharacterMoveSheet(this.actor)
        this.actor.moveSheet.render(true, { focus: true })
      } else {
        new CharacterMoveSheet(this.actor).render(true)
      }
    }
  }
}
