import type { ChatMessageDataConstructorData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/chatMessageData'
import { compact, get } from 'lodash-es'
import type { DocumentSubTypes } from '../../types/helperTypes'
import type { IronswornActor } from '../actor/actor'
import { IronswornSettings } from '../helpers/settings'
import { localizeRank } from '../helpers/util'
import type { IronswornItem } from '../item/item'

type ActorTypeHandler<T extends DocumentSubTypes<'Actor'> = any> = (
	actor: IronswornActor<T>,
	data: Partial<ActorSource<T>>
) => string | undefined

type ActorTypeHandlers = {
	[Subtype in DocumentSubTypes<'Actor'>]?: ActorTypeHandler<Subtype>
}

type ItemTypeHandler<T extends DocumentSubTypes<'Item'> = any> = (
	actor: IronswornItem<T>,
	data: Partial<ItemSource<T>>
) => string | undefined

type ItemTypeHandlers = {
	[Subtype in DocumentSubTypes<'Item'>]?: ItemTypeHandler<Subtype>
}

export function registerChatAlertHooks() {
	Hooks.on(
		'preUpdateActor',
		async (actor: IronswornActor, data: any, options, _userId: number) => {
			if (!IronswornSettings.get('log-changes')) return
			if (options.suppressLog) return

			let content: string | undefined
			if (data.name) {
				content = game.i18n.format('IRONSWORN.ChatAlert.Renamed', {
					name: data.name
				})
			} else {
				content = ACTOR_TYPE_HANDLERS[actor.type]?.(actor, data)
				if (!content) return
			}

			sendToChat(actor, content)
		}
	)

	Hooks.on(
		'preUpdateItem',
		async (
			item: IronswornItem,
			data: ActorSource,
			_options,
			_userId: number
		) => {
			if (!IronswornSettings.get('log-changes')) return
			if (item.parent == null) return // No logging for unowned items, they don't matter

			let content: string | undefined
			if (data.name != null) {
				content = game.i18n.format('IRONSWORN.ChatAlert.renamed', {
					name: data.name
				})
			} else {
				content = ITEM_TYPE_HANDLERS[item.type]?.(item, data)
			}
			if (content == null) return

			const itemName = item.type === 'bondset' ? '' : item.name
			sendToChat(item.parent, `${itemName} ${content}`)
		}
	)

	Hooks.on(
		'preCreateItem',
		async (item: IronswornItem, options, _userId: number) => {
			if (!IronswornSettings.get('log-changes')) return
			if (item.parent == null) return // No logging for unowned items, they don't matter
			if (options.suppressLog) return
			if (item.type === 'bondset') return // No need to log this

			void sendToChat(
				item.parent,
				game.i18n.format('IRONSWORN.ChatAlert.Added', { name: item.name })
			)
		}
	)

	Hooks.on(
		'preDeleteItem',
		async (item: IronswornItem, options, _userId: number) => {
			if (!IronswornSettings.get('log-changes')) return
			if (item.parent == null) return // No logging for unowned items, they don't matter
			if (options.suppressLog) return

			void sendToChat(
				item.parent,
				game.i18n.format('IRONSWORN.ChatAlert.Deleted', { name: item.name })
			)
		}
	)
}

const ACTOR_TYPE_HANDLERS: ActorTypeHandlers = {
	character: (actor, data) => {
		const gameIsStarforged = IronswornSettings.starforgedToolsEnabled

		// Ironsworn XP
		if (data.system?.xp !== undefined) {
			const oldXp = actor.system.xp
			const newXp = data.system.xp
			if (newXp > oldXp) {
				return game.i18n.format('IRONSWORN.ChatAlert.MarkedXP', {
					amt: newXp - oldXp
				})
			} else {
				return game.i18n.format('IRONSWORN.ChatAlert.UnmarkedXP', {
					amt: oldXp - newXp
				})
			}
		}

		// Starforged legacy XP
		for (const kind of ['quests', 'bonds', 'discoveries'] as const) {
			const oldXp = actor.system.legacies[`${kind}XpSpent`]
			const newXp = get(data.system, `legacies.${kind}XpSpent`)
			if (newXp !== undefined) {
				if (newXp > oldXp) {
					return game.i18n.format('IRONSWORN.ChatAlert.MarkedXP', {
						amt: newXp - oldXp
					})
				} else {
					return game.i18n.format('IRONSWORN.ChatAlert.UnmarkedXP', {
						amt: oldXp - newXp
					})
				}
			}
		}

		for (const resource of [
			'momentum',
			'health',
			'spirit',
			'supply'
		] as const) {
			const newValue = get(data.system, resource)?.value
			if (newValue !== undefined) {
				const oldValue = get(actor.system, resource).value
				const signPrefix = newValue > oldValue ? '+' : ''
				const i18nStat = game.i18n.localize(
					`IRONSWORN.${resource.capitalize()}`
				)
				return game.i18n.format('IRONSWORN.ChatAlert.AdjustedStat', {
					amt: `${signPrefix}${newValue - oldValue}`,
					stat: i18nStat,
					val: newValue
				})
			}
		}

		return undefined
	},

	shared: (actor, data) => {
		if (data.system?.supply !== undefined) {
			const newValue = data.system.supply.value
			const oldValue = actor.system.supply.value
			const signPrefix = newValue > oldValue ? '+' : ''
			const i18nStat = game.i18n.localize('IRONSWORN.Supply')
			return game.i18n.format('IRONSWORN.ChatAlert.AdjustedStat', {
				amt: `${signPrefix}${newValue - oldValue}`,
				stat: i18nStat,
				val: newValue
			})
		}

		return undefined
	},

	site: (actor, data) => {
		if (data.system?.track.rank != null) {
			return game.i18n.format('IRONSWORN.ChatAlert.RankChanged', {
				old: localizeRank(actor.system.track.rank),
				new: localizeRank(data.system.track.rank)
			})
		}
		if (data.system?.track.ticks !== undefined) {
			const advanced = data.system.track.ticks > actor.system.track.ticks
			return game.i18n.localize(
				`IRONSWORN.ChatAlert.Progress${advanced ? 'Advanced' : 'Reduced'}`
			)
		}
		return undefined
	}
}

const ITEM_TYPE_HANDLERS: ItemTypeHandlers = {
	progress: (item, data) => {
		if (data.system?.track.rank) {
			return game.i18n.format('IRONSWORN.ChatAlert.rankChanged', {
				old: localizeRank(item.system.track.rank),
				new: localizeRank(data.system.track.rank)
			})
		}
		if (data.system?.track.ticks !== undefined) {
			const advanced = data.system.track.ticks > item.system.track.ticks
			return game.i18n.localize(
				`IRONSWORN.ChatAlert.progress${advanced ? 'Advanced' : 'Reduced'}`
			)
		}
		if (data.system?.clock != null && item.system.clock != null) {
			const change = data.system.clock.value - item.system.clock.value
			const advanced = data.system.clock.value > item.system.clock.value
			const completed = data.system.clock.value >= item.system.clock.max
			let i18nKey = 'IRONSWORN.ChatAlert.clock'
			switch (true) {
				case completed: {
					i18nKey += 'Completed'
					break
				}
				case advanced: {
					i18nKey += 'Advanced'
					break
				}
				default: {
					i18nKey += 'Set'
					break
				}
			}
			if (change > 2) {
				i18nKey += 'ManySegments'
			} else if (change === 2) {
				i18nKey += 'TwoSegments'
			} else if (change === 1) {
				i18nKey += 'OneSegment'
			}
			return game.i18n.format(i18nKey, {
				change,
				max: item.system.clock?.max,
				old: item.system.clock?.value,
				new: data.system.clock?.value
			})
		}
		if (data.system?.completed !== undefined) {
			return game.i18n.localize(
				`IRONSWORN.ChatAlert.completed${
					data.system?.completed ? 'Marked' : 'Unmarked'
				}`
			)
		}
		return undefined
	},

	asset: (item, data) => {
		if (data.system?.abilities !== undefined) {
			const oldEnables = item.system.abilities.map((x) => x.enabled)
			const newEnables = data.system.abilities.map((x) => x.enabled)
			for (let i = 0; i < oldEnables.length; i++) {
				if (oldEnables[i] !== newEnables[i]) {
					const descriptors = ['First', 'Second', 'Third', 'Fourth', 'Fifth']
					const pos = game.i18n.localize(`IRONSWORN.${descriptors[i]}`)
					if (newEnables[i])
						return game.i18n.format('IRONSWORN.ChatAlert.MarkedAbility', {
							pos
						})
					return game.i18n.format('IRONSWORN.ChatAlert.UnmarkedAbility', {
						pos
					})
				}
			}
		}

		if (data.system?.track?.value !== undefined) {
			const newValue = data.system.track.value
			const oldValue = item.system.track.value
			const signPrefix = newValue > oldValue ? '+' : ''
			return game.i18n.format('IRONSWORN.ChatAlert.AdjustedStat', {
				amt: `${signPrefix}${newValue - oldValue}`,
				stat: item.system.track.name,
				val: newValue
			})
		}

		if (data.system?.exclusiveOptions !== undefined) {
			const selectedOption = data.system.exclusiveOptions.find(
				(x) => x.selected
			)
			if (selectedOption == null) return
			return game.i18n.format('IRONSWORN.ChatAlert.MarkedOption', {
				name: selectedOption?.name
			})
		}

		if (data.system?.fields !== undefined) {
			for (let i = 0; i < data.system.fields.length; i++) {
				const newField = data.system.fields[i]
				const oldField = item.system.fields[i]
				if (oldField != null && oldField?.value !== newField.value) {
					return game.i18n.format('IRONSWORN.ChatAlert.SetField', {
						name: newField.name,
						val: newField.value
					})
				}
			}
		}

		// TODO: conditions

		return undefined
	},

	bondset: (item, data) => {
		if (data.system?.bonds !== undefined) {
			const oldLen = Object.values(item.system.bonds).length
			const newLen = Object.values(data.system.bonds).length
			if (oldLen < newLen) {
				return game.i18n.localize('IRONSWORN.ChatAlert.AddBond')
			} else if (newLen < oldLen) {
				return game.i18n.localize('IRONSWORN.ChatAlert.LostBond')
			}
		}

		return undefined
	}
}

export async function sendToChat(speaker: IronswornActor, msg: string) {
	const whisperToCurrentUser =
		speaker.getFlag('foundry-ironsworn', 'muteBroadcast') ?? false
	const whisper = whisperToCurrentUser ? compact([game.user?.id]) : undefined

	const messageData: ChatMessageDataConstructorData = {
		whisper,
		content: `<em>${msg}</em>`,
		type: CONST.CHAT_MESSAGE_TYPES.EMOTE,
		speaker: { actor: speaker.id }
	}

	const cls = CONFIG.ChatMessage.documentClass
	return await cls.create(messageData as any)
}
