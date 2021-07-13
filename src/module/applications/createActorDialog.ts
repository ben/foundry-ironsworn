import { IronswornActor } from '../actor/actor'
import { IronswornSettings } from '../helpers/settings'

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

    html.find('.ironsworn__character__create').on('click', (ev) => this._characterCreate.call(this, ev))
    html.find('.ironsworn__shared__create').on('click', (ev) => this._sharedCreate.call(this, ev))
  }

  async _characterCreate(ev: JQuery.ClickEvent) {
    ev.preventDefault()

    // Roll an Ironlander name
    const table: any = await this._ironlanderNameTable()
    const drawResult = await table?.draw({ displayChat: false })

    this._createWithFolder(drawResult.results[0]?.data.text, 'character')
  }

  async _sharedCreate(ev: JQuery.ClickEvent) {
    ev.preventDefault()
    this._createWithFolder('Shared', 'shared')
  }

  async _createWithFolder(name: string, type: string) {
    const data: any = {
      name,
      type,
      folder: this.options.folder || undefined,
    }
    await IronswornActor.create(data, { renderSheet: true })
    await this.close()
  }

  async _ironlanderNameTable(): Promise<RollTable | undefined> {
    const table = game.tables?.find((x) => x.name === 'Oracle: Ironlander Names')
    if (table) return table

    const pack = game.packs?.get('foundry-ironsworn.ironsworntables')
    const entry = pack?.index.find((x: any) => x.name === 'Oracle: Ironlander Names')
    if (entry) return pack?.getDocument((entry as any)._id) as RollTable | undefined
    return undefined
  }
}
