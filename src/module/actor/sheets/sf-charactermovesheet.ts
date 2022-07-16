import { IronswornItem } from '../../item/item'
import { VueApplication } from '../../vue/vueapp'

import CharacterMoveSheet from '../../vue/sf-charactermovesheet.vue'
import { IronswornActor } from '../actor'
import { VueSheetRenderHelperOptions } from '../../vue/vue-render-helper'

export class SFCharacterMoveSheet extends VueApplication {
  constructor(
    protected actor: IronswornActor,
    options?: Partial<ApplicationOptions>
  ) {
    super(options)
  }

  get renderHelperOptions(): Partial<VueSheetRenderHelperOptions> {
    return {
      components: { 'sfcharacter-movesheet': CharacterMoveSheet },
      provides: { $actor: this.actor },
      vueData: async () => ({
        actor: this.actor.toObject(),
      }),
    }
  }

  render(
    force?: boolean | undefined,
    inputOptions?: Application.RenderOptions<ApplicationOptions> | undefined
  ): this {
    super.render(force, inputOptions)
    this.actor.apps[this.appId] = this
    return this
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
