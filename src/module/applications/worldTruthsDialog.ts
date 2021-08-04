import { IronswornSettings } from "../helpers/settings"

export class WorldTruthsDialog extends FormApplication<FormApplication.Options> {
  constructor() {
    super({})
  }

  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      title: game.i18n.localize('IRONSWORN.YourWorldTruths'),
      template: 'systems/foundry-ironsworn/templates/truths.hbs',
      id: 'world-truths-dialog',
      resizable: true,
      classes: ['ironsworn', 'sheet', 'world-truths', `theme-${IronswornSettings.theme}`],
      width: 500,
      height: 500,
    } as FormApplication.Options)
  }

  async _updateObject() {
    // Nothing to do
  }

  static maybeShow() {
    // Show this dialog if appropriate
    new WorldTruthsDialog().render(true)
  }
}
