import { ActorDataConstructorData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/actorData'
import _ from 'lodash'
import { IronswornActor } from '../actor/actor'
import { getFoundryTableByDfId } from '../dataforged'
import { IronswornSettings } from '../helpers/settings'

interface CreateActorDialogOptions extends FormApplicationOptions {
  folder: string
}

export class CreateActorDialog extends FormApplication<CreateActorDialogOptions> {
  constructor() {
    super({})
  }

  async _updateObject() {
    // No update necessary.
  }

  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      title: game.i18n.format('DOCUMENT.Create', {
        type: game.i18n.localize('DOCUMENT.Actor'),
      }),
      template: 'systems/foundry-ironsworn/templates/actor/create.hbs',
      id: 'new-actor-dialog',
      resizable: false,
      classes: [
        'ironsworn',
        'sheet',
        'new-actor',
        `theme-${IronswornSettings.get('theme')}`,
      ],
      width: 650,
      height: 200,
    } as FormApplicationOptions)
  }

  getData(_options?: Application.RenderOptions): any {
    return {
      sfenabled: IronswornSettings.starforgedToolsEnabled,
    }
  }

  activateListeners(html: JQuery) {
    super.activateListeners(html)

    html
      .find('[data-on-click="createCharacter"]')
      .on('click', (ev) => this._createCharacter.call(this, ev))
    html
      .find('[data-on-click="createShared"]')
      .on('click', (ev) => this._createShared.call(this, ev))
    html
      .find('[data-on-click="createSite"]')
      .on('click', (ev) => this._createSite.call(this, ev))
    html
      .find('[data-on-click="createFoe"]')
      .on('click', (ev) => this._createFoe.call(this, ev))
    html
      .find('[data-on-click="createSfcharacter"]')
      .on('click', (ev) => this._createSfcharacter.call(this, ev))
    html
      .find('[data-on-click="createStarship"]')
      .on('click', (ev) => this._createStarship.call(this, ev))
    html
      .find('[data-on-click="createSflocation"]')
      .on('click', (ev) => this._createSflocation.call(this, ev))
  }

  async _createCharacter(ev: JQuery.ClickEvent) {
    ev.preventDefault()

    // Roll an Ironlander name
    const tables = await this._ironlanderNameTables()
    const table = _.sample(tables)
    const drawResult = await table?.draw({ displayChat: false })

    this._createWithFolder(
      drawResult?.results[0]?.data.text || CONFIG.Actor.typeLabels['character'],
      'character',
      ev.currentTarget.dataset.img || undefined
    )
  }

  async _createShared(ev: JQuery.ClickEvent) {
    ev.preventDefault()
    this._createWithFolder(
      CONFIG.Actor.typeLabels['shared'],
      'shared',
      ev.currentTarget.dataset.img || undefined
    )
  }

  async _createSite(ev: JQuery.ClickEvent) {
    ev.preventDefault()
    this._createWithFolder(
      CONFIG.Actor.typeLabels['site'],
      'site',
      ev.currentTarget.dataset.img || undefined
    )
  }

  async _createFoe(ev: JQuery.ClickEvent) {
    ev.preventDefault()
    this._createWithFolder(
      CONFIG.Actor.typeLabels['foe'],
      'foe',
      ev.currentTarget.dataset.img || undefined
    )
  }

  async _createSfcharacter(ev: JQuery.ClickEvent) {
    ev.preventDefault()

    const name = await this._randomStarforgedName()

    this._createWithFolder(
      name || CONFIG.Actor.typeLabels['character'],
      'character',
      ev.currentTarget.dataset.img || undefined,
      'ironsworn.StarforgedCharacterSheet'
    )
  }

  async _createStarship(ev: JQuery.ClickEvent) {
    ev.preventDefault()
    this._createWithFolder(
      CONFIG.Actor.typeLabels['starship'],
      'starship',
      ev.currentTarget.dataset.img || undefined
    )
  }

  async _createSflocation(ev: JQuery.ClickEvent) {
    ev.preventDefault()
    this._createWithFolder(
      CONFIG.Actor.typeLabels['location'],
      'location',
      ev.currentTarget.dataset.img || undefined
    )
  }

  async _createWithFolder(
    name: string,
    type: IronswornActor['type'],
    img: string,
    sheetClass?: string
  ) {
    const data: ActorDataConstructorData & Record<string, any> = {
      name,
      img,
      type,
      token: {
        displayName: CONST.TOKEN_DISPLAY_MODES.ALWAYS,
        disposition: CONST.TOKEN_DISPOSITIONS.NEUTRAL,
        actorLink: true,
      },
      folder: this.options.folder || undefined,
    }
    if (sheetClass) {
      data.flags = { core: { sheetClass } }
    }
    await IronswornActor.create(data, { renderSheet: true })
    await this.close()
  }

  async _ironlanderNameTables(): Promise<RollTable[] | undefined> {
    const tableA = (await getFoundryTableByDfId(
      'Ironsworn/Oracles/Name/Ironlander/A'
    )) as any
    const tableB = (await getFoundryTableByDfId(
      'Ironsworn/Oracles/Name/Ironlander/B'
    )) as any
    if (tableA && tableB) return [tableA, tableB]
    return undefined
  }

  async _randomStarforgedName(): Promise<string | undefined> {
    const firstTable = (await getFoundryTableByDfId(
      'Starforged/Oracles/Characters/Name/Given_Name'
    )) as any
    const lastTable = (await getFoundryTableByDfId(
      'Starforged/Oracles/Characters/Name/Family_Name'
    )) as any
    if (!firstTable || !lastTable) return undefined

    const first = await firstTable.draw({ displayChat: false })
    const last = await lastTable.draw({ displayChat: false })
    return `${first?.results[0]?.text} ${last?.results[0]?.text}`
  }
}
