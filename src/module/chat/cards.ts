import { compact, flatten } from 'lodash-es'
import type { IronswornItem } from '../item/item'
import { IronswornRollMessage } from '../rolls'
import { ChallengeResolutionDialog } from '../rolls/challenge-resolution-dialog'
import { OracleTable } from '../roll-table/oracle-table'

export class IronswornChatCard {
	id?: string | null

	constructor(message: ChatMessage, html: JQuery) {
		void this.updateBinding(message, html)
	}

	get message(): ChatMessage | undefined {
		return game.messages?.get(this.id ?? '')
	}

	async attachMoveOracleContextMenu(html: JQuery) {
		// Set up context-menu bindings
		const moveLinks = html.find('a.content-link')
		const maybeTablePromises = moveLinks.map(async (_i, el) => {
			const { uuid } = el.dataset
			if (!uuid) return []

			const fItem = (await fromUuid(uuid)) as IronswornItem<'sfmove'>
			if (fItem?.type !== 'sfmove') return []

			const system = fItem.system
			const oracleIds = system.dsOracleIds ?? []
			return await Promise.all(oracleIds.map((x) => OracleTable.getByDsId(x)))
		})
		const tables = compact(flatten(await Promise.all(maybeTablePromises)))
		if (tables.length === 0) return

		new ContextMenu(
			html,
			`.chat-message`,
			tables.map((t) => ({
				name: t.name ?? '',
				icon: '<i class="isicon-oracle inline"></i>',
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

		const item = (await fromUuid(uuid)) as any
		if (item.type === 'sfmove') {
			ev.preventDefault()
			ev.stopPropagation()
			CONFIG.IRONSWORN.emitter.emit('highlightMove', item.uuid)
		}
		if (item instanceof OracleTable) {
			ev.preventDefault()
			ev.stopImmediatePropagation()
			CONFIG.IRONSWORN.emitter.emit(
				'highlightOracle',
				item.flags?.['foundry-ironsworn']?.dsid ?? ''
			)
		}
	}

	async _oracleNavigate(ev: JQuery.ClickEvent) {
		ev.preventDefault()
		const { dsid } = ev.target.dataset
		CONFIG.IRONSWORN.emitter.emit('highlightOracle', dsid)
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
		void ChallengeResolutionDialog.showForMessage(msgId)
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
			void existing.updateBinding(message, html)
		} else {
			message.ironswornCard = new IronswornChatCard(message, html)
		}
	}

	static registerHooks() {
		Hooks.on('renderChatMessage', IronswornChatCard.bind)
	}
}
