import { VueSheetRenderHelperOptions } from '../vue/vue-render-helper'
import { VueApplication } from '../vue/vueapp'
import VueDialog from '../vue/challenge-resolution-dialog.vue'

export class ChallengeResolutionDialog extends VueApplication {
  constructor(
    protected messageId: string,
    options?: Partial<ApplicationOptions>
  ) {
    super(options)
  }

  static async showForMessage(messageId: string) {
    const foundryMessage = game.messages?.get(messageId)
    const el = await foundryMessage?.getHTML()
    if (!el) return

    console.log({
      left: window.innerWidth - 620,
      top: Math.min(el[0].offsetTop, window.innerHeight - 300),
    })
    return new ChallengeResolutionDialog(messageId, {
      left: window.innerWidth - 620,
      top: Math.min(el[0].offsetTop, window.innerHeight - 300),
    }).render(true)
  }

  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      template:
        'systems/foundry-ironsworn/templates/rolls/challenge-resolution-dialog.hbs',
      width: 300,
      height: 280,
    })
  }

  get renderHelperOptions(): Partial<VueSheetRenderHelperOptions> {
    return {
      components: { 'challenge-resolution-dialog': VueDialog },
      vueData: async () => ({ messageId: this.messageId }),
    }
  }
}
