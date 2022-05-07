import { IronswornSettings } from "../helpers/settings"

export class FirstStartDialog extends FormApplication<FormApplication.Options> {
  constructor() {
    super({})
  }

  static get defaultOptions(): FormApplication.Options {
    return mergeObject(super.defaultOptions, {
      title: game.i18n.localize('IRONSWORN.Welcome'),
      template: 'systems/foundry-ironsworn/templates/first-start.hbs',
      id: 'first-start-dialog',
      resizable: false,
      classes: ['ironsworn', 'sheet', 'first-start', `theme-${IronswornSettings.theme}`],
      width: 600,
      height: 700,
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
  }

  static async maybeShow() {
    // TODO: only show on first start; maybe do a setting here?
    new FirstStartDialog().render(true)
  }
}
