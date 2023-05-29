import { compact, flatten } from 'lodash-es'
import type { SFMoveDataPropertiesData } from '../item/itemtypes'
import type { IronswornItem } from '../item/item'
import { IronswornRollMessage } from '../rolls'
import { ChallengeResolutionDialog } from '../rolls/challenge-resolution-dialog'
import { OracleTable } from '../roll-table/oracle-table'
import { Oracles } from '../roll-table/oracles'

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
		const maybeTablePromises = moveLinks.map(async (_i, el) => {
			const { pack, id } = el.dataset
			if (pack == null || id == null) return []

			const fPack = game.packs.get(pack)
			const fItem = fPack?.get(id) as IronswornItem
			if (fItem?.type !== 'sfmove') return []

			const system = fItem.system as SFMoveDataPropertiesData
			const oracleIds = system.Oracles ?? []
			return await Promise.all(oracleIds.map(Oracles.find))
		})
		const tables = compact(flatten(await Promise.all(maybeTablePromises)))
		if (tables.length === 0) return

		ContextMenu.create(
			ui.chat!,
			html,
			`.message-content`,
			tables.map((t) => ({
				name: t.name ?? '',
				icon: '<i class="isicon-oracle"></i>',
				callback: async () => await t.draw()
			}))
		)
	}

	async updateBinding(message: ChatMessage, html: JQuery) {
		// Do not store html here
		this.id = message.id

		await this.attachMoveOracleContextMenu(html)

		html.find('a.content-link').on('click', async (ev) => {
			await this._moveNavigate.call(this, ev)
		})
		html.find('a.oracle-category-link').on('click', async (ev) => {
			await this._oracleNavigate.call(this, ev)
		})
		html
			.find('.burn-momentum')
			.on('click', async (ev) => await this._burnMomentum.call(this, ev))
		html
			.find('.burn-momentum-sf')
			.on('click', async (ev) => await this._burnMomentum.call(this, ev))
		html
			.find('.ironsworn-roll-burn-momentum')
			.on('click', async (ev) => await this._burnMomentum.call(this, ev))
		html
			.find('[data-iron-action="oracleReroll"]')
			.on('click', (ev) => this._oracleReroll.call(this, ev))
		if (!navigator.clipboard) {
			html
				.find('.copy-result')
				.addClass('disabled')
				.parent()
				.attr('data-tooltip', game.i18n.localize('IRONSWORN.ClipboardDisabled'))
				.attr('data-tooltip-direction', 'LEFT')
		} else {
			html.find('.copy-result').on('click', async (ev) => {
				await this._oracleResultCopy.call(this, ev)
			})
		}
		html
			.find('.ironsworn-roll-resolve')
			.on('click', (ev) => this._resolveChallenge.call(this, ev))
		html
			.find('[data-iron-action="oracleRoll"]')
			.on('click', (ev) => this._oracleRoll.call(this, ev))
	}

	async _moveNavigate(ev: JQuery.ClickEvent) {
		const { uuid } = ev.currentTarget.dataset

		const item = (await fromUuid(uuid)) as IronswornItem
		if (item?.type !== 'sfmove') {
			console.log('falling through')
			return // (TextEditor as any)._onClickContentLink(ev)
		}

		ev.preventDefault()
		ev.stopPropagation()
		CONFIG.IRONSWORN.emitter.emit('highlightMove', item.uuid)
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
		return await irmsg?.burnMomentum()
	}

	async _resolveChallenge(ev: JQuery.ClickEvent) {
		ev.preventDefault()

		const msgId = $(ev.target).parents('.chat-message').data('message-id')
		ChallengeResolutionDialog.showForMessage(msgId)
	}

	async _oracleReroll(ev: JQuery.ClickEvent) {
		ev.preventDefault()

		const msgId = $(ev.target).parents('.chat-message').data('message-id')
		await OracleTable.reroll(msgId)
	}

	async _oracleRoll(ev: JQuery.ClickEvent) {
		ev.preventDefault()
		const { tableid } = ev.currentTarget.dataset
		return await OracleTable.ask(tableid)
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
		if (existing != null) {
			existing.updateBinding(message, html)
		} else {
			message.ironswornCard = new IronswornChatCard(message, html)
		}
	}

	static registerHooks() {
		Hooks.on('renderChatMessage', IronswornChatCard.bind)
	}
}
