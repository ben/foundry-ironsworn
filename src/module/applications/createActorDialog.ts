import { IronswornActor } from "../actor/actor"
import { IronswornSettings } from "../helpers/settings"

interface CreateActorDialogOptions extends FormApplication.Options {
  folder: string
}

export class CreateActorDialog extends FormApplication<CreateActorDialogOptions> {
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
      width: 500,
      height: 230,
    } as FormApplication.Options)
  }

  activateListeners(html: JQuery) {
    super.activateListeners(html)

    html.find('.ironsworn__character__create').on('click', ev => this._characterCreate.call(this, ev))
    html.find('.ironsworn__shared__create').on('click', ev => this._sharedCreate.call(this, ev))
  }

  _characterCreate(ev: JQuery.ClickEvent) {
    ev.preventDefault()
    this._createWithFolder('Character', 'character')
  }
  _sharedCreate(ev: JQuery.ClickEvent) {
    ev.preventDefault()
    this._createWithFolder('Shared', 'shared')
  }

  async _createWithFolder(name: string, type: string) {
    const data: any = {
      name,
      type,
      folder: this.options.folder || undefined,
    }
    await IronswornActor.create(data, {renderSheet: true})
    await this.close()
  }
}
