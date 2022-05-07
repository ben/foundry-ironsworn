import { IronswornSettings } from '../helpers/settings'

export class FirstStartDialog extends FormApplication<FormApplication.Options> {
  constructor() {
    super({})
  }

  static get defaultOptions(): FormApplication.Options {
    return mergeObject(super.defaultOptions, {
      title: game.i18n.localize('IRONSWORN.First Start.Welcome'),
      template: 'systems/foundry-ironsworn/templates/first-start.hbs',
      id: 'first-start-dialog',
      resizable: false,
      classes: ['ironsworn', 'sheet', 'first-start', `theme-${IronswornSettings.theme}`],
      width: 600,
      height: 735,
    } as FormApplication.Options)
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
      console.log({ name, value })
      if (name === 'sheet') {
        const setting = game.settings.get('core', 'sheetClasses') as any
        foundry.utils.mergeObject(setting, { 'Actor.character': value })
        await game.settings.set('core', 'sheetClasses', setting)
      }
      if (name === 'moves') {
      }
      if (name === 'truths') {
      }
    }

    this.close()
  }

  static async maybeShow() {
    // TODO: only show on first start; maybe do a setting here?
    new FirstStartDialog().render(true)
  }
}
