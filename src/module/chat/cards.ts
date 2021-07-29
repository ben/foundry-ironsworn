import { capitalize } from 'lodash'
import { moveDataByName, MoveOracle, MoveOracleEntry } from '../helpers/data'
import { MoveContentCallbacks } from './movecontentcallbacks'
import { HIT_TYPE } from './chatrollhelpers'
import { DelveDomainDataProperties, DelveThemeDataProperties } from '../item/itemtypes'
import { IronswornActor } from '../actor/actor'
import { maybeShowDice, RollDialog } from '../helpers/roll'

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
    html.find('.ironsworn__revealdanger__roll').on('click', (ev) => this._revealDanger.call(this, ev))
    html.find('.ironsworn__sojourn__extra__roll').on('click', ev => this._sojournExtra.call(this, ev))
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
      bonusContent = MoveContentCallbacks[move]?.call(this, { hitType: hittype as HIT_TYPE, stat })
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

    await this.replaceSelectorWith(
      ev.currentTarget,
      '.bonus-content',
      `
        <p class="flexrow" style="align-items: center;">
          <span>${oracle.name}</span>
          <span class="roll die d10" style="flex: 0 0 25px;">${rollTotal}</span>
        </p>

        <h4 class="dice-formula">
          ${result.low}–${result.high}: ${result.description}
        </h4>
      `
    )
  }

  async _revealDanger(ev: JQuery.ClickEvent) {
    ev.preventDefault()

    const move = await moveDataByName('Reveal a Danger')
    const oracle = move?.oracles && move.oracles[0]
    if (!oracle) return

    const siteId = ev.currentTarget.dataset.site
    const site = game.actors?.contents.find((x) => x.id === siteId)

    const { result, rollTotal } = await rollOnOracle(oracle)
    const realResult = dangerFromSite(rollTotal, result, site)

    await this.replaceSelectorWith(
      ev.currentTarget,
      '.bonus-content',
      `
        <p class="flexrow" style="align-items: center;">
          <span>${oracle.name}</span>
          <span class="roll die d10" style="flex: 0 0 25px;">${rollTotal}</span>
        </p>

        <h4 class="dice-formula">
          ${realResult?.low}–${realResult?.high}: ${realResult?.description}
        </h4>
      `
    )
  }

  async _sojournExtra(ev: JQuery.ClickEvent) {
    const actorId = ev.currentTarget.dataset.actor
    const actor = game.actors?.get(actorId)
    if (!actor) return

    const move = await moveDataByName('Sojourn')
    if (!move) return

    move.Name = `${move.Name} – ${game.i18n.localize('IRONSWORN.Focus')}`
    move.Description = move.ExtraDescription || ''
    move.Strong = move.ExtraStrong || ''
    move.Weak = move.ExtraWeak || ''
    move.Miss = move.ExtraMiss || ''
    move.Stats = ['heart']
    delete move.ExtraDescription
    RollDialog.show({move, actor})
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
  const upperLimit = Math.max(...oracle.table.map((x) => x.high))
  const roll = new Roll(`1d${upperLimit}`)
  await roll.evaluate({ async: true })
  maybeShowDice(roll)
  const rollTotal = roll.total as number
  const result = oracle.table.find((x) => x.low <= rollTotal && x.high >= rollTotal)
  return { result, rollTotal }
}

function dangerFromSite(rollTotal: number, result?: MoveOracleEntry, site?: IronswornActor): MoveOracleEntry | undefined {
  if (rollTotal > 45 || !site) return result

  const theme = site.items.find((x) => x.type === 'delve-theme')
  const themeData = theme?.data as DelveThemeDataProperties | undefined
  let theResult = themeData?.data.dangers.find((x) => x.low <= rollTotal && x.high >= rollTotal)
  if (theResult) {
    theResult.description = `(${theme?.name}) ${theResult.description}`
    return theResult
  }

  const domain = site.items.find((x) => x.type === 'delve-domain')
  const domainData = domain?.data as DelveDomainDataProperties | undefined
  theResult = domainData?.data.dangers.find((x) => x.low <= rollTotal && x.high >= rollTotal)
  if (theResult) theResult.description = `(${domain?.name}) ${theResult.description}`
  return theResult
}
