import { IronswornSettings } from '../helpers/settings'

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

  static async maybeShow() {
    // Show this dialog if appropriate
    // TODO: return if dont-bug-me setting is set

    const d = new Dialog({
      title: game.i18n.localize('IRONSWORN.YourWorldTruths'),
      content: '<p>Would you like to generate your world truths?</p>',
      buttons: {
        yes: {
          icon: '<i class="fas fa-check"></i>',
          label: 'Yes',
          callback: () => new WorldTruthsDialog().render(true),
        },
        no: {
          icon: '<i class="fas fa-times"></i>',
          label: 'Not this time',
        },
        goaway: {
          icon: '<i class="fas fa-times"></i>',
          label: 'Never',
          callback: () => {},
        },
      },
      default: 'two',
      render: (_html) => console.log('Register interactivity in the rendered dialog'),
      close: (_html) => console.log('This always is logged no matter which option is chosen'),
    })
    d.render(true)
  }
}
