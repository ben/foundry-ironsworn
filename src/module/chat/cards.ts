import { capitalize } from 'lodash'
import { moveDataByName, MoveOracle, MoveOracleEntry } from '../helpers/data'
import { MoveContentCallbacks } from './movecontentcallbacks'
import { HIT_TYPE, rollAndDisplayOracleResult } from './chatrollhelpers'
import {
  DelveDomainDataProperties,
  DelveThemeDataProperties,
  SFMoveDataProperties,
} from '../item/itemtypes'
import { IronswornActor } from '../actor/actor'
import { maybeShowDice, RollDialog } from '../helpers/rolldialog'
import { defaultActor } from '../helpers/actors'
import { IronswornItem } from '../item/item'
import { IronswornHandlebarsHelpers } from '../helpers/handlebars'
import { cachedDocumentsForPack } from '../features/pack-cache'

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
    this.roll = message.isRoll ? message.roll : undefined

    html
      .find('a.content-link')
      .removeClass('content-link') // Prevent default Foundry behavior
      .on('click', (ev) => this._moveNavigate.call(this, ev))
    html
      .find('a.oracle-category-link')
      .on('click', (ev) => this._oracleNavigate.call(this, ev))
    html
      .find('.burn-momentum')
      .on('click', (ev) => this._burnMomentum.call(this, ev))
    html
      .find('.burn-momentum-sf')
      .on('click', (ev) => this._sfBurnMomentum.call(this, ev))
    html
      .find('.ironsworn__delvedepths__roll')
      .on('click', (ev) => this._delveDepths.call(this, ev))
    html
      .find('.ironsworn__revealdanger__roll')
      .on('click', (ev) => this._revealDanger.call(this, ev))
    html
      .find('.ironsworn__sojourn__extra__roll')
      .on('click', (ev) => this._sojournExtra.call(this, ev))
    html
      .find('.ironsworn__paytheprice__roll')
      .on('click', (ev) => this._payThePriceExtra.call(this, ev))
    html
      .find('.starforged__oracle__roll')
      .on('click', (ev) => this._sfOracleRoll.call(this, ev))
    html
      .find('.starforged__oracle__reroll')
      .on('click', (ev) => this._sfOracleReroll.call(this, ev))
  }

  async _moveNavigate(ev: JQuery.ClickEvent) {
    ev.preventDefault()
    const { pack, id } = ev.target.dataset

    let item: IronswornItem | undefined
    if (pack) {
      const fPack = game.packs.get(pack)
      item = (await fPack?.getDocument(id)) as IronswornItem
    } else {
      item = await game.items?.get(id)
    }
    if (!item || !['move', 'sfmove'].includes(item?.data?.type || '')) {
      console.log('falling through')
      return (TextEditor as any)._onClickContentLink(ev)
    }

    for (const actor of game.actors?.contents || []) {
      if (
        (actor.moveSheet as any)?._state >= 0 &&
        actor.moveSheet?.highlightMove
      ) {
        return actor.moveSheet.highlightMove(item)
      }
    }

    // Found the item, but no move sheet open. Do nothing.
  }

  async _oracleNavigate(ev: JQuery.ClickEvent) {
    ev.preventDefault()
    const { dfid } = ev.target.dataset
    for (const actor of game.actors?.contents || []) {
      if (
        (actor.moveSheet as any)?._state >= 0 &&
        actor.moveSheet?.highlightMove
      ) {
        return actor.moveSheet.highlightOracle(dfid)
      }
    }
  }

  async _burnMomentum(ev: JQuery.ClickEvent) {
    ev.preventDefault()

    const { actor, move, stat, hittype } = ev.target.dataset

    const theActor = game.actors?.get(actor)
    theActor?.burnMomentum()

    let bonusContent: string | undefined
    let result: string
    if (move) {
      const theMove = await moveDataByName(move)
      result = theMove && theMove[capitalize(hittype.toLowerCase())]
      bonusContent = MoveContentCallbacks[move]?.call(this, {
        hitType: hittype as HIT_TYPE,
        stat,
      })
    } else {
      const i18nKey = {
        [HIT_TYPE.STRONG]: 'StrongHit',
        [HIT_TYPE.WEAK]: 'WeakHit',
        [HIT_TYPE.MISS]: 'Miss',
      }[hittype]
      result = `<strong>${game.i18n.localize('IRONSWORN.' + i18nKey)}</strong>`
    }

    const parent = $(ev.currentTarget).parents('.message-content')
    parent.find('.roll-result').addClass('strikethru')
    parent.find('.roll-result button').prop('disabled', true)
    parent.find('.momentum-burn').html(`
      <h3>${game.i18n.localize('IRONSWORN.MomentumBurnt')}</h3>
      ${result || ''}
      ${bonusContent || ''}
    `)

    const content = parent.html()
    await this.message?.update({ content })
  }

  async _sfBurnMomentum(ev: JQuery.ClickEvent) {
    ev.preventDefault()
    const { actor, move, stat, hittype, hittypetext } = ev.target.dataset
    console.log({ actor, move, stat, hittype, hittypetext })

    // Fetch the actor and move items
    const theActor = game.actors?.get(actor)
    const isPack = game.packs.get('foundry-ironsworn.ironswornmoves')
    const sfPack = game.packs.get('foundry-ironsworn.starforgedmoves')
    const theMove = ((await isPack?.getDocument(move)) ??
      (await sfPack?.getDocument(move))) as IronswornItem

    // Get the new result
    const k = {
      [HIT_TYPE.STRONG]: 'Strong Hit',
      [HIT_TYPE.WEAK]: 'Weak Hit',
      [HIT_TYPE.MISS]: 'Miss',
    }[hittype]
    const moveData = theMove.data as SFMoveDataProperties
    const newOutcome = moveData.data.Outcomes?.[k]?.Text

    // Burn the momentum
    theActor?.burnMomentum()

    // Replace the chat-card HTML
    const parent = $(ev.currentTarget).parents('.message-content')
    parent.find('.roll-result').addClass('strikethru')
    parent.find('.roll-result button').prop('disabled', true)
    parent.find('.momentum-burn').html(`
      <h3>${game.i18n.localize('IRONSWORN.MomentumBurnt')}</h3>
      <strong>${hittypetext}:</strong>
      ${IronswornHandlebarsHelpers.enrichMarkdown(newOutcome)}
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

  async _sojournExtra(_ev: JQuery.ClickEvent) {
    const move = await moveDataByName('Sojourn')
    if (!move) return

    move.Name = `${move.Name} – ${game.i18n.localize('IRONSWORN.Focus')}`
    move.Description = move.ExtraDescription || ''
    move.Strong = move.ExtraStrong || ''
    move.Weak = move.ExtraWeak || ''
    move.Miss = move.ExtraMiss || ''
    move.Stats = ['heart']
    delete move.ExtraDescription

    const actor = defaultActor()
    RollDialog.show({ move, actor })
  }

  async _payThePriceExtra(ev: JQuery.ClickEvent) {
    const move = await moveDataByName('Pay the Price')
    const oracle = move?.oracles?.[0]
    if (!oracle) return

    const { result, rollTotal } = await rollOnOracle(oracle)
    await this.replaceSelectorWith(
      ev.currentTarget,
      '.bonus-content',
      `
        <p class="flexrow" style="align-items: center;">
          <span>${oracle.name}</span>
          <span class="roll die d10" style="flex: 0 0 25px;">${rollTotal}</span>
        </p>

        <h4 class="dice-formula">
          ${result?.low}–${result?.high}: ${result?.description}
        </h4>
      `
    )
  }

  async _sfOracleRoll(ev: JQuery.ClickEvent) {
    ev.preventDefault()
    const pack = game.packs.get('foundry-ironsworn.starforgedoracles')
    const { tableid } = ev.target.dataset
    const table = (await pack?.getDocument(tableid)) as any | undefined
    rollAndDisplayOracleResult(table, 'foundry-ironsworn.starforgedoracles')
  }

  async _sfOracleReroll(ev: JQuery.ClickEvent) {
    ev.preventDefault()

    const parent = $(ev.target).parent('.table-draw')

    const packName =
      parent.data('pack-name') || 'foundry-ironsworn.starforgedoracles'
    const pack = game.packs.get(packName)
    await cachedDocumentsForPack(packName) // Pre-load from server

    const tableId = parent.data('table-id')
    const table = await pack?.getDocument(tableId)
    rollAndDisplayOracleResult(table as RollTable, packName)
  }

  async replaceSelectorWith(
    el: HTMLElement,
    selector: string,
    newContent: string
  ) {
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

async function rollOnOracle(
  oracle: MoveOracle
): Promise<{ result?: MoveOracleEntry; rollTotal: number }> {
  const upperLimit = Math.max(...oracle.table.map((x) => x.high))
  const roll = new Roll(`1d${upperLimit}`)
  await roll.evaluate({ async: true })
  maybeShowDice(roll)
  const rollTotal = roll.total as number
  const result = oracle.table.find(
    (x) => x.low <= rollTotal && x.high >= rollTotal
  )
  return { result, rollTotal }
}

function dangerFromSite(
  rollTotal: number,
  result?: MoveOracleEntry,
  site?: IronswornActor
): MoveOracleEntry | undefined {
  if (rollTotal > 45 || !site) return result

  const theme = site.items.find((x) => x.type === 'delve-theme')
  const themeData = theme?.data as DelveThemeDataProperties | undefined
  let theResult = themeData?.data.dangers.find(
    (x) => x.low <= rollTotal && x.high >= rollTotal
  )
  if (theResult) {
    theResult.description = `(${theme?.name}) ${theResult.description}`
    return theResult
  }

  const domain = site.items.find((x) => x.type === 'delve-domain')
  const domainData = domain?.data as DelveDomainDataProperties | undefined
  theResult = domainData?.data.dangers.find(
    (x) => x.low <= rollTotal && x.high >= rollTotal
  )
  if (theResult)
    theResult.description = `(${domain?.name}) ${theResult.description}`
  return theResult
}
