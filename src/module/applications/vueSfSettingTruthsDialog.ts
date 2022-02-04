import { VueApplication } from './vueapp'

export class sfSettingTruthsDialogVue extends VueApplication {

  constructor() {
    super({})
  }

  static get defaultOptions(): Application.Options {
    return mergeObject(super.defaultOptions, {
      title: game.i18n.localize('IRONSWORN.SFSettingTruthsTitle'),
      template: 'systems/foundry-ironsworn/templates/sf-truths-vue.hbs',
      id: 'setting-truths-dialog',
      resizable: true,
      width: 600,
      height: 700,
    })
  }

  async getData(_options?: Application.RenderOptions): Promise<Record<string, unknown>> {
    const truths = await fetch('systems/foundry-ironsworn/assets/sf-setting-truths.json').then((x) => x.json())
    return {
      truths: truths['Setting Truths']
    }
  }
}
