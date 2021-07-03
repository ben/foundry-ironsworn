import { cachedMoves, moveDataByName } from '../../helpers/data'
import { IronswornSettings } from '../../helpers/settings'
import { IronswornActor } from '../actor'

function translateOrEmpty(key: string): string {
  const str = game.i18n.localize(key)
  return str === key ? '' : str
}

export class CharacterMoveSheet extends FormApplication<any, any, IronswornActor> {
  get actor() {
    return this.object
  }

  constructor(object, options?: any) {
    super(object, options)

    this.actor.moveSheet = this
  }

  async close(opts?: any) {
    this.actor.moveSheet = undefined

    return super.close(opts)
  }

  async _updateObject() {
    // No update necessary.
  }

  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      template: 'systems/foundry-ironsworn/templates/actor/moves.hbs',
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

  get title() {
    return `${game.i18n.localize('IRONSWORN.Moves')} — ${this.actor.name}`
  }

  activateListeners(html: JQuery) {
    html.find('.ironsworn__builtin__move__expand').on('click', (e) => this._handleBuiltInMoveExpand.call(this, e))
    html.find('.ironsworn__builtin__move__roll').on('click', (e) => this._handleBuiltInMoveRoll.call(this, e))
    html.find('.ironsworn__oracle').on('click', (e) => this._handleOracleClick.call(this, e))
  }

  async getData() {
    const data: any = super.getData()
    const BuiltInMoves = await cachedMoves()

    data.builtInMoves = []
    for (const category of BuiltInMoves.Categories) {
      data.builtInMoves.push({
        separator: true,
        title: category.Name.replace(/ Moves/, ''),
      })
      for (const move of category.Moves) {
        const baseKey = `IRONSWORN.MoveContents.${move.Name}`
        data.builtInMoves.push({
          ...move,
          title: game.i18n.localize(`${baseKey}.title`),
          description: game.i18n.localize(`${baseKey}.description`),
          strong: translateOrEmpty(`${baseKey}.strong`),
          weak: translateOrEmpty(`${baseKey}.weak`),
          miss: translateOrEmpty(`${baseKey}.miss`),
        })
      }
    }

    return data
  }

  _handleBuiltInMoveExpand(e: JQuery.ClickEvent) {
    e.preventDefault()
    const li = $(e.currentTarget).parents('li')
    const summary = li.children('.move-summary')
    if (li.hasClass('expanded')) {
      summary.slideUp(200)
    } else {
      summary.slideDown(200)
    }
    li.toggleClass('expanded')
  }

  async _handleBuiltInMoveRoll(e: JQuery.ClickEvent) {
    e.preventDefault()
    const moveName = e.currentTarget.dataset.name
    const moveData = await moveDataByName(moveName)
    if (moveData) {
    }
  }

  async _handleOracleClick(e: JQuery.ClickEvent) {
    e.preventDefault()
    const tableName = e.currentTarget.dataset.table
    let table = game.tables?.find((x) => x.name === tableName)
    if (!table) {
      const pack = game.packs?.get('foundry-ironsworn.ironsworntables') as any
      if (pack) {
        const entry = pack?.index.find((x) => x.name == tableName)
        if (entry) table = (await pack.getDocument(entry._id)) as RollTable | undefined
      }
    }
    table?.draw()
  }
}
