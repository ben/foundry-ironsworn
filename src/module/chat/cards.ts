import { compact, flatten } from 'lodash'
import { moveDataByName, MoveOracle, MoveOracleEntry } from '../helpers/data'
import { MoveContentCallbacks } from './movecontentcallbacks'
import {
  DelveDomainDataPropertiesData,
  DelveThemeDataPropertiesData,
  SFMoveDataPropertiesData,
} from '../item/itemtypes'
import { IronswornActor } from '../actor/actor'
import { maybeShowDice, RollDialog } from '../helpers/rolldialog'
import { defaultActor } from '../helpers/actors'
import { IronswornItem } from '../item/item'
import { IronswornHandlebarsHelpers } from '../helpers/handlebars'
import { cachedDocumentsForPack } from '../features/pack-cache'
import { DfRollOutcome, RollOutcome } from '../rolls/ironsworn-roll'
import { IronswornRollMessage, OracleRollMessage } from '../rolls'
import { ChallengeResolutionDialog } from '../rolls/challenge-resolution-dialog'
import { getFoundryTableByDfId } from '../dataforged'

export class IronswornChatCard {
  id?: string | null

  constructor(message: ChatMessage, html: JQuery) {
    this.updateBinding(message, html)
  }

  get message(): ChatMessage | undefined {
    return game.messages?.get(this.id || '')
  }

  async attachMoveOracleContextMenu(html: JQuery) {
    // Set up context-menu bindings
    const moveLinks = html.find('a[draggable]')
    const maybeTablePromises = moveLinks.map((_i, el) => {
      const { pack, id } = el.dataset
      if (!pack || !id) return []

      const fPack = game.packs.get(pack)
      const fItem = fPack?.get(id) as IronswornItem
      if (fItem?.type !== 'sfmove') return []

      const system = fItem.system as SFMoveDataPropertiesData
      const oracleIds = system.Oracles ?? []
      return Promise.all(oracleIds.map(getFoundryTableByDfId))
    })
    const tables = compact(flatten(await Promise.all(maybeTablePromises)))
    if (tables.length === 0) return

    ContextMenu.create(
      ui.chat!,
      html,
      `.message-content`,
      tables.map((t) => ({
        name: t.name || '',
        icon: '<i class="isicon-oracle"></i>',
        callback: async () => {
          const msg = await OracleRollMessage.fromTableId(
            t.id,
            t.pack || undefined
          )
          msg.createOrUpdate()
        },
      }))
    )
  }

  updateBinding(message: ChatMessage, html: JQuery) {
    // Do not store html here
    this.id = message.id

    this.attachMoveOracleContextMenu(html)

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
      .find('.ironsworn-roll-burn-momentum')
      .on('click', (ev) => this._burnMomentum.call(this, ev))
    html
      .find('.oracle-roll .oracle-reroll')
      .on('click', (ev) => this._oracleReroll.call(this, ev))
    html
      .find('.copy-result')
      .on('click', (ev) => this._oracleResultCopy.call(this, ev))
    html
      .find('.ironsworn-roll-resolve')
      .on('click', (ev) => this._resolveChallenge.call(this, ev))
    html
      .find('.starforged__oracle__roll')
      .on('click', (ev) => this._oracleRoll.call(this, ev))
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

    CONFIG.IRONSWORN.emitter.emit('highlightMove', item.id ?? '')
  }

  async _oracleNavigate(ev: JQuery.ClickEvent) {
    ev.preventDefault()
    const { dfid } = ev.target.dataset
    CONFIG.IRONSWORN.emitter.emit('highlightOracle', dfid)
  }

  async _burnMomentum(ev: JQuery.ClickEvent) {
    ev.preventDefault()

    const msgId = $(ev.target).parents('.chat-message').data('message-id')
    const irmsg = await IronswornRollMessage.fromMessage(msgId)
    return irmsg?.burnMomentum()
  }

  async _resolveChallenge(ev: JQuery.ClickEvent) {
    ev.preventDefault()

    const msgId = $(ev.target).parents('.chat-message').data('message-id')
    ChallengeResolutionDialog.showForMessage(msgId)
  }

  async _oracleReroll(ev: JQuery.ClickEvent) {
    ev.preventDefault()

    const msgId = $(ev.target).parents('.chat-message').data('message-id')
    const orm = await OracleRollMessage.fromMessage(msgId)
    await orm?.forceRoll()
    return orm?.createOrUpdate()
  }

  async _oracleRoll(ev: JQuery.ClickEvent) {
    ev.preventDefault()
    const { tableid } = ev.currentTarget.dataset
    const sfPack = game.packs.get('foundry-ironsworn.starforgedoracles')
    const isPack = game.packs.get('foundry-ironsworn.ironswornoracles')
    const table = ((await sfPack?.getDocument(tableid)) ??
      (await isPack?.getDocument(tableid))) as RollTable | undefined
    if (!table?.id) return

    const msg = await OracleRollMessage.fromTableId(
      table.id,
      table.pack || undefined
    )
    msg.createOrUpdate()
  }

  async _oracleReroll(ev: JQuery.ClickEvent) {
    ev.preventDefault()

    const parent = $(ev.target).parent('.table-draw')

    const packName =
      parent.data('pack-name') || 'foundry-ironsworn.starforgedoracles'
    const pack = game.packs.get(packName)
    await cachedDocumentsForPack(packName) // Pre-load from server

    const tableId = parent.data('table-id')
    const table = await pack?.getDocument(tableId)
    if (!table?.id) return

    const msg = await OracleRollMessage.fromTableId(
      table.id,
      table.pack || undefined
    )
    msg.createOrUpdate()
  }

  async _oracleResultCopy(ev: JQuery.ClickEvent) {
    const { result } = ev.currentTarget.dataset
    await navigator.clipboard.writeText(result)
    const icon = $(ev.currentTarget).find('i.fas')
    icon.removeClass('fa-copy').addClass('fa-check')
    await new Promise((r) => setTimeout(r, 2000))
    icon.removeClass('fa-check').addClass('fa-copy')
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
