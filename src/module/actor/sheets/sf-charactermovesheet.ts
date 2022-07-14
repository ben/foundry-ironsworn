import { IronswornItem } from '../../item/item'
import { VueActorApp } from '../../vue/vueactorapp'

import CharacterMoveSheet from '../../vue/sf-charactermovesheet.vue'

export class SFCharacterMoveSheet extends VueActorApp {
  getComponents(): { [k: string]: any } {
    return { 'sfcharacter-movesheet': CharacterMoveSheet }
  }

  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      template:
        'systems/foundry-ironsworn/templates/actor/sf-charactermoves.hbs',
      resizable: true,
      width: 350,
      height: 820,
      left: 685,
    })
  }

  get title() {
    return `${game.i18n.localize('IRONSWORN.Moves')} — ${this.actor.name}`
  }

  // TODO: these probably still don't work
  async highlightMove(move: IronswornItem) {
    this.maximize()
    return (this.vueRoot?.$refs.child as any)?.['highlightMove']?.(move)
  }

  async highlightOracle(oracleId: string) {
    this.maximize()
    return (this.vueRoot?.$refs.child as any)?.['highlightOracle']?.(oracleId)
  }
}
