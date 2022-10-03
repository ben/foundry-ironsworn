import { VueSheetRenderHelperOptions } from '../vue/vue-render-helper'
import { VueApplication } from '../vue/vueapp'
import VueDialog from '../vue/challenge-resolution-dialog.vue'

export class ChallengeResolutionDialog extends VueApplication {
  private constructor(
    protected messageId: string,
    options?: Partial<ApplicationOptions>
  ) {
    super(options)
  }

  static openDialogs = {} as { [k: string]: ChallengeResolutionDialog }

  static async showForMessage(messageId: string) {
    // Prevent duplicates
    if (this.openDialogs[messageId]) {
      return this.openDialogs[messageId].render(true)
    }

    const el = $(`.chat-message[data-message-id="${messageId}"`)
    if (el.length < 1) return

    this.openDialogs[messageId] = new ChallengeResolutionDialog(messageId, {
      left: window.innerWidth - 620,
      top: Math.min(el[0].offsetTop - 50, window.innerHeight - 300),
    }).render(true)

    return this.openDialogs[messageId]
  }

  close(options?: {}): Promise<void> {
    delete ChallengeResolutionDialog.openDialogs[this.messageId]
    return super.close(options)
  }

  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      template:
        'systems/foundry-ironsworn/templates/rolls/challenge-resolution-dialog.hbs',
      title: 'IRONSWORN.ResolveChallenge',
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
