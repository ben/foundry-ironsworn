import { IronswornSettings } from '../helpers/settings'
import { SFSettingTruthsDialogVue } from './vueSfSettingTruthsDialog'
import { WorldTruthsDialog } from './worldTruthsDialog'

export class FirstStartDialog extends FormApplication<FormApplicationOptions> {
  constructor() {
    super({})
  }

  static get defaultOptions(): FormApplicationOptions {
    return mergeObject(super.defaultOptions, {
      title: game.i18n.localize('IRONSWORN.First Start.Welcome'),
      template: 'systems/foundry-ironsworn/templates/first-start.hbs',
      id: 'first-start-dialog',
      resizable: false,
      classes: [
        'ironsworn',
        'sheet',
        'first-start',
        `theme-${IronswornSettings.theme}`,
      ],
      width: 600,
      height: 700,
    } as FormApplicationOptions)
  }

  async _updateObject() {
    // Nothing to do
  }

  activateListeners(html: JQuery) {
    super.activateListeners(html)
    html.find('.ironsworn__save').on('click', (ev) => this._save.call(this, ev))
  }

  async _save(ev: JQuery.ClickEvent) {
    ev.preventDefault()

    const setValues = this.element.find('form').serializeArray()
    for (const { name, value } of setValues) {
      if (name === 'sheet') {
        const setting = game.settings.get('core', 'sheetClasses') as any
        foundry.utils.mergeObject(setting, { 'Actor.character': value })
        await game.settings.set('core', 'sheetClasses', setting)
      }
      if (name === 'moves') {
        await game.settings.set('foundry-ironsworn', 'toolbox', value)
      }
      if (name === 'truths') {
        if (value === 'ironsworn') {
          new WorldTruthsDialog().render(true)
        }

        if (value === 'starforged') {
          new SFSettingTruthsDialogVue().render(true)
        }
      }
    }

    game.settings.set('foundry-ironsworn', 'prompt-world-truths', false)
    this.close()
  }

  static async maybeShow() {
    if (!game.settings.get('foundry-ironsworn', 'prompt-world-truths')) {
      return
    }

    new FirstStartDialog().render(true)
  }
}
