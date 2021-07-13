import { IronswornSettings } from "../helpers/settings"

export class CreateActorDialog extends FormApplication<any, any, any> {
  async _updateObject() {
    // No update necessary.
  }

  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      title: game.i18n.localize('IRONSWORN.CreateActor'),
      template: 'systems/foundry-ironsworn/templates/actor/create.hbs',
      id: 'new-actor-dialog',
      resizable: false,
      classes: ['ironsworn', 'sheet', 'new-actor', `theme-${IronswornSettings.theme}`],
      width: 800,
      height: 330,
    } as FormApplication.Options)
  }

  activateListeners(html) {
    super.activateListeners(html)
  }
}
