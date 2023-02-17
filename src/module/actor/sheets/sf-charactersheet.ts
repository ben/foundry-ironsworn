import { SFCharacterTour } from '../../features/tours/sf-character-tour'
import { IronswornSettings } from '../../helpers/settings'
import SfCharacterSheet from '../../vue/sf-charactersheet.vue'
import { VueActorSheet } from '../../vue/vueactorsheet'
import { SFCharacterMoveSheet } from './sf-charactermovesheet'

export class StarforgedCharacterSheet extends VueActorSheet {
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      width: 630,
      height: 820,
      left: 50,
      rootComponent: SfCharacterSheet,
    }) as any
  }

  render(...renderArgs: any[]) {
    super.render(...renderArgs)
    if (this._state <= Application.RENDER_STATES.NONE) this._openMoveSheet()
    return Promise.resolve(this) as any
  }

  _getHeaderButtons() {
    const [editButton, sheetButton, tokenButton, ...otherButtons] =
      super._getHeaderButtons()
    return [
      {
        class: 'ironsworn-open-move-sheet',
        label: game.i18n.localize('IRONSWORN.ITEMS.TypeMove'),
        icon: 'fas fa-directions',
        onclick: (e) => this._openMoveSheet(e),
      },
      editButton,
      sheetButton,
      tokenButton,
      {
        class: 'ironsworn-help',
        icon: 'fa fa-circle-question',
        onclick: (e) => new SFCharacterTour(this.actor).start(),
      },
      ...otherButtons,
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
