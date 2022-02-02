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
}
