import CharacterMoveSheet from '../../vue/sf-charactermovesheet.vue'
import { IronswornActor } from '../actor'
import { VueSheetRenderHelperOptions } from '../../vue/vue-render-helper'
import { App } from 'vue'
import { $ActorKey } from '../../vue/provisions'
import { VueAppMixin } from '../../vue/vueapp.js'

export class SFCharacterMoveSheet extends VueAppMixin(Application) {
  constructor(
    protected actor: IronswornActor,
    protected toolset: 'ironsworn' | 'starforged' = 'starforged',
    options?: Partial<ApplicationOptions>
  ) {
    super(options)
  }

  get renderHelperOptions(): Partial<VueSheetRenderHelperOptions> {
    return {
      components: { 'sfcharacter-movesheet': CharacterMoveSheet },
      vueData: async () => ({
        actor: this.actor.toObject(),
        toolset: this.toolset,
      }),
    }
  }

  setupVueApp(app: App<any>): void {
    app.provide($ActorKey, this.actor)
  }

  render(
    force?: boolean | undefined,
    inputOptions?: Application.RenderOptions<ApplicationOptions> | undefined
  ): this {
    super.render(force, inputOptions)
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
    return `${game.i18n.localize('IRONSWORN.ITEMS.TypeMove')} — ${
      this.actor.name
    }`
  }
}
