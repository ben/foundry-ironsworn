import { attachInlineRollListeners } from '../../helpers/roll'
import { IronswornActor } from '../actor'

export class CharacterMoveSheet extends FormApplication<any, any, IronswornActor> {
  get actor() {
    return this.object
  }

  async _updateObject() {
    // No update necessary.
  }

  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      template: 'systems/foundry-ironsworn/templates/actor/moves.hbs',
      resizable: true,
      classes: ['ironsworn', 'sheet', 'moves'],
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
    html.find('.ironsworn__builtin__move').each((_i, el) => {
      attachInlineRollListeners($(el), { actor: this.actor, name: el.dataset.name })
    })
    html.find('.ironsworn__oracle').on('click', (e) => this._handleOracleClick.call(this, e))
  }

  getData() {
    const data: any = super.getData()

    data.builtInMoves = []
    for (const moveName of MOVES) {
      if (moveName.startsWith('---')) {
        data.builtInMoves.push({
          separator: true,
          title: moveName.substr('--- '.length), // TODO: run this through i18n
        })
      } else {
        data.builtInMoves.push({
          title: game.i18n.localize(`IRONSWORN.Moves:${moveName}:title`),
          description: game.i18n.localize(`IRONSWORN.Moves:${moveName}:description`),
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

const MOVES = [
  '--- Fate',
  'Pay the Price',
  'Ask the Oracle',
  '--- Combat',
  'Enter the Fray',
  'Strike',
  'Clash',
  'Turn the Tide',
  'End the Fight',
  'Battle',
  '--- Adventure',
  'Face Danger',
  'Secure An Advantage',
  'Gather Information',
  'Heal',
  'Resupply',
  'Make Camp',
  'Undertake a Journey',
  'Reach Your Destination',
  '--- Relationship',
  'Compel',
  'Sojourn',
  'Draw the Circle',
  'Forge a Bond',
  'Test Your Bond',
  'Aid Your Ally',
  'Write Your Epilogue',
  '--- Quest',
  'Swear an Iron Vow',
  'Reach a Milestone',
  'Fulfill Your Vow',
  'Forsake Your Vow',
  'Advance',
  '--- Suffer',
  'Endure Harm',
  'Endure Stress',
  'Companion Endure Harm',
  'Face Death',
  'Face Desolation',
  'Out of Supply',
  'Face a Setback',
]
