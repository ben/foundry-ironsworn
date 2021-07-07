import { IronswornSettings } from '../../helpers/settings'
import { IronswornActor } from '../actor'

export class CharacterBondSheet extends FormApplication<any, any, IronswornActor> {
  get actor() {
    return this.object
  }

  constructor(...args) {
    super(...args)
    this.actor.bondSheet = this
  }

  async close(...args) {
    this.actor.bondSheet = undefined
    return super.close(...args)
  }

  async _updateObject() {
    // No update necessary.
  }

  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      template: 'systems/foundry-ironsworn/templates/actor/bonds.hbs',
      resizable: true,
      classes: ['ironsworn', 'sheet', 'moves', `theme-${IronswornSettings.theme}`],
      width: 350,
      height: 800,
      left: 755,
      tabs: [
        {
          navSelector: '.ironsworn__tabs__selector',
          contentSelector: '.ironsworn__tabs__content',
        },
      ],
    } as FormApplication.Options)
  }
}
