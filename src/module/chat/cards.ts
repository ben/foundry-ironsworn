import { capitalize } from 'lodash'
import { moveDataByName, MoveOracle, MoveOracleEntry } from '../helpers/data'
import { MoveContentCallbacks } from './movecontentcallbacks'
import { HIT_TYPE } from './chatrollhelpers'

export class IronswornChatCard {
  id?: string | null
  roll?: Roll | null

  constructor(message: ChatMessage, html: JQuery) {
    this.updateBinding(message, html)
  }

  get message(): ChatMessage | undefined {
    return game.messages?.get(this.id || '')
  }

  updateBinding(message: ChatMessage, html: JQuery) {
    // Do not store html here
    this.id = message.id
    this.roll = message.roll

    html.find('.burn-momentum').on('click', (ev) => this._burnMomentum.call(this, ev))
    html.find('.ironsworn__delvedepths__roll').on('click', (ev) => this._delveDepths.call(this, ev))
  }

  async _burnMomentum(ev: JQuery.ClickEvent) {
    ev.preventDefault()

    const { actor, move, stat, hittype } = ev.target.dataset

    const theActor = game.actors?.get(actor)
    theActor?.burnMomentum()

    let bonusContent: string | undefined
    let result: string | undefined
    if (move) {
      const theMove = await moveDataByName(move)
      result = theMove && theMove[capitalize(hittype.toLowerCase())]
      bonusContent = MoveContentCallbacks[move]?.call(this, hittype as HIT_TYPE, stat)
    }

    const parent = $(ev.currentTarget).parents('.message-content')
    parent.find('.roll-result').addClass('strikethru')
    parent.find('.roll-result button').prop('disabled', true)
    parent.find('.momentum-burn').html(`
      <h3>${game.i18n.localize('IRONSWORN.MomentumBurnt')}</h3>
      ${result}
      ${bonusContent || ''}
    `)

    const content = parent.html()
    await this.message?.update({ content })
  }

  async _delveDepths(ev: JQuery.ClickEvent) {
    ev.preventDefault()

    const { stat } = ev.currentTarget.dataset
    const move = await moveDataByName('Delve the Depths')
    const oracle = move?.oracles?.find((x) => x.stat === stat)
    if (!oracle) return

    const { result, rollTotal } = await rollOnOracle(oracle)
    if (!result) return

    await this.replaceSelectorWith(ev.currentTarget, '.bonus-content', `
      <p class="flexrow" style="align-items: center;">
        <span>${oracle.name}</span>
        <span class="roll die d10" style="flex: 0 0 25px;">${rollTotal}</span>
      </p>

      <h4 class="dice-formula">
        ${result.low}–${result.high}: ${result.description}
      </h4>
    `)
  }

  async replaceSelectorWith(el: HTMLElement, selector: string, newContent: string) {
    const parent = $(el).parents('.message-content')
    parent.find(selector).html(newContent)
    const content = parent.html()
    await this.message?.update({ content })
  }

  static async bind(message: ChatMessage, html: JQuery) {
    const existing = message.ironswornCard
    if (existing) {
      existing.updateBinding(message, html)
    } else {
      message.ironswornCard = new IronswornChatCard(message, html)
    }
  }

  static registerHooks() {
    Hooks.on('renderChatMessage', IronswornChatCard.bind)
  }
}

// Extend type
declare global {
  interface ChatMessage {
    ironswornCard?: IronswornChatCard
  }
}

async function rollOnOracle(oracle: MoveOracle): Promise<{ result?: MoveOracleEntry; rollTotal: number }> {
  const upperLimit = Math.max(...oracle.table.map(x => x.high))
  const roll = new Roll(`1d${upperLimit}`)
  await roll.evaluate({ async: true })
  const rollTotal = roll.total as number
  const result = oracle.table.find((x) => x.low <= rollTotal && x.high >= rollTotal)
  return { result, rollTotal }
}
