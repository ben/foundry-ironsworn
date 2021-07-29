import { negate } from 'lodash'
import { cachedMoves, moveDataByName } from '../../helpers/data'
import { attachInlineRollListeners, RollDialog } from '../../helpers/roll'
import { IronswornSettings } from '../../helpers/settings'
import { IronswornItem } from '../../item/item'
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
    })
  }

  get title() {
    return `${game.i18n.localize('IRONSWORN.Moves')} — ${this.actor.name}`
  }

  activateListeners(html: JQuery) {
    html.find('.ironsworn__move__search').on('keyup', (ev) => this._moveSearch.call(this, ev))
    html.find('.ironsworn__move__search__clear').on('click', (ev) => this._moveSearchClear.call(this, ev))

    html.find('.ironsworn__move__expand').on('click', (e) => this._handleBuiltInMoveExpand.call(this, e))
    html.find('.ironsworn__builtin__move__roll').on('click', (e) => this._handleBuiltInMoveRoll.call(this, e))
    html.find('.ironsworn__custom__move__roll').on('click', (e) => this._handleCustomMoveRoll.call(this, e))
    html.find('.ironsworn__oracle').on('click', (e) => this._handleOracleClick.call(this, e))

    html.find('.ironsworn__builtin__move').each((_i, el) => {
      attachInlineRollListeners($(el), { actor: this.actor, name: el.dataset.name })
    })
    html.find('.ironsworn__custom__move').each((_i, el) => {
      const move = this.actor.items.get(el.dataset.id || '')
      if (move) {
        attachInlineRollListeners($(el), { actor: this.actor, name: move.name || '' })
      }
    })

    // Custom sheet listeners for every ItemType
    for (const itemClass of CONFIG.IRONSWORN.itemClasses) {
      itemClass.activateActorSheetListeners(html, this)
    }
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
          name: game.i18n.localize(`${baseKey}.title`),
          description: game.i18n.localize(`${baseKey}.description`),
          strong: translateOrEmpty(`${baseKey}.strong`),
          weak: translateOrEmpty(`${baseKey}.weak`),
          miss: translateOrEmpty(`${baseKey}.miss`),
          extradescription: translateOrEmpty(`${baseKey}.extradescription`),
          extrastrong: translateOrEmpty(`${baseKey}.extrastrong`),
          extraweak: translateOrEmpty(`${baseKey}.extraweak`),
          extramiss: translateOrEmpty(`${baseKey}.extramiss`),
        })
      }
    }

    data.moves = this.actor.items.filter((x) => x.type === 'move')

    return data
  }

  _moveSearch(e: JQuery.KeyUpEvent) {
    const query = $(e.currentTarget).val()
    if (!query || query === '') {
      this.element.find('ol.moves>h2').show()
      this.element.find('ol.moves>li').show()
    } else {
      this.element.find('ol.moves>h2').hide()
      const re = new RegExp($(e.currentTarget).val() as string, 'i')
      const doesMatch = (_i, el: HTMLElement): boolean => re.test($(el).find('h4').text())
      this.element.find('ol.moves>li').filter(negate(doesMatch)).hide()
      this.element.find('ol.moves>li').filter(doesMatch).show()
    }
  }

  _moveSearchClear(_e: JQuery.ClickEvent) {
    this.element.find('.ironsworn__move__search').val('')
    this.element.find('ol.moves>h2').show()
    this.element.find('ol.moves li').show()
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
    const move = await moveDataByName(moveName)
    if (move) {
      RollDialog.show({
        move,
        actor: this.actor,
      })
    }
  }

  async _handleCustomMoveRoll(e: JQuery.ClickEvent) {
    e.preventDefault()
    const moveId = e.currentTarget.dataset.id || ''
    const move = await this.actor.items.get(moveId)
    if (move) {
      RollDialog.show({
        move: move.getMoveData(),
        actor: this.actor,
      })
    }
  }

  async _handleOracleClick(e: JQuery.ClickEvent) {
    e.preventDefault()
    const tableName = e.currentTarget.dataset.table
    let table = game.tables?.find((x) => x.name === tableName)
    if (!table) {
      const pack = game.packs?.get('foundry-ironsworn.ironsworntables')
      if (pack) {
        const entry = pack?.index.find((x: any) => x.name == tableName)
        if (entry) {
          table = (await pack.getDocument((entry as any)._id)) as RollTable | undefined
        }
      }
    }
    ;(table as any)?.draw()
  }
}

function rerenderMoveSheet(item: IronswornItem) {
  if (item.data.type === 'move' && item.parent?.moveSheet) {
    item.parent.moveSheet.render(true)
  }
}
Hooks.on('updateItem', rerenderMoveSheet)
Hooks.on('createItem', rerenderMoveSheet)
Hooks.on('deleteItem', rerenderMoveSheet)
