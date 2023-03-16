import type { ChatMessageDataConstructorData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/chatMessageData'
import { capitalize, compact, get } from 'lodash-es'
import type { IronswornActor } from '../actor/actor'
import type {
	CharacterDataPropertiesData,
	SharedDataPropertiesData,
	SiteDataPropertiesData,
	StarshipDataPropertiesData
} from '../actor/actortypes'
import { RANKS } from '../constants'
import { IronswornSettings } from '../helpers/settings'
import type { IronswornItem } from '../item/item'
import type {
	AssetDataPropertiesData,
	BondsetDataPropertiesData,
	ProgressDataPropertiesData
} from '../item/itemtypes'

type ActorTypeHandler = (IronswornActor, any) => string | undefined

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
		async (item: IronswornItem, data: any, _options, _userId: number) => {
			if (!IronswornSettings.get('log-changes')) return
			if (item.parent == null) return // No logging for unowned items, they don't matter

			let content: string | undefined
			if (data.name) {
				content = game.i18n.format('IRONSWORN.ChatAlert.renamed', {
					name: data.name
				})
			} else {
				content = ITEM_TYPE_HANDLERS[item.type]?.(item, data)
			}
			if (!content) return

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

			sendToChat(
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

			sendToChat(
				item.parent,
				game.i18n.format('IRONSWORN.ChatAlert.Deleted', { name: item.name })
			)
		}
	)
}

const ACTOR_TYPE_HANDLERS: Record<string, ActorTypeHandler> = {
	character: (actor: IronswornActor, data) => {
		const characterData = actor.system as CharacterDataPropertiesData
		const gameIsStarforged = IronswornSettings.starforgedToolsEnabled

		// Ironsworn XP
		if (data.system?.xp !== undefined) {
			const oldXp = characterData.xp
			const newXp = data.system.xp as number
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
		for (const kind of ['quests', 'bonds', 'discoveries']) {
			const oldXp = characterData.legacies[`${kind}XpSpent`]
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

		for (const stat of ['momentum', 'health', 'spirit', 'supply']) {
			const newValue = get(data.system, stat)
			if (newValue !== undefined) {
				const oldValue = get(characterData, stat)
				const signPrefix = newValue > oldValue ? '+' : ''
				const i18nStat = game.i18n.localize(`IRONSWORN.${capitalize(stat)}`)
				return game.i18n.format('IRONSWORN.ChatAlert.AdjustedStat', {
					amt: `${signPrefix}${newValue - oldValue}`,
					stat: i18nStat,
					val: newValue
				})
			}
		}

		const debilities = [
			'corrupted',
			'cursed',
			'encumbered',
			'maimed',
			'shaken',
			'tormented',
			'unprepared',
			'wounded',
			'permanentlyharmed',
			'traumatized',
			'doomed',
			'indebted',
			'battered',
			'custom1',
			'custom2'
		]
		for (const debility of debilities) {
			const conditionType = gameIsStarforged ? `impact` : `debility`
			const newValue = get(data.system?.debility, debility)

			if (newValue !== undefined) {
				const oldValue = characterData.debility[debility]
				if (oldValue === newValue) continue
				const i18nPath = `IRONSWORN.${conditionType.toUpperCase()}`
				const i18nDebility = `<b>${
					debility.startsWith('custom')
						? get(characterData.debility, `${debility}name`)
						: game.i18n.localize(`${i18nPath}.${capitalize(debility)}`)
				}</b>`

				const params = gameIsStarforged
					? { impact: i18nDebility }
					: { debility: i18nDebility }

				if (newValue)
					return game.i18n.format(
						`IRONSWORN.ChatAlert.Marked${capitalize(conditionType)}`,
						params
					)
				return game.i18n.format(
					`IRONSWORN.ChatAlert.Cleared${capitalize(conditionType)}`,
					params
				)
			}
		}

		return undefined
	},

	shared: (actor: IronswornActor, data) => {
		const sharedData = actor.system as SharedDataPropertiesData

		if (data.system?.supply !== undefined) {
			const newValue = data.system.supply
			const oldValue = sharedData.supply
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

	starship: (actor: IronswornActor, data) => {
		const starshipData = actor.system as StarshipDataPropertiesData
		const impacts = ['cursed', 'battered']
		for (const impact of impacts) {
			const newValue = get(data.system?.debility, impact)
			if (newValue !== undefined) {
				const oldValue = starshipData.debility[impact]
				if (oldValue === newValue) continue
				const i18nImpact = game.i18n.localize(
					`IRONSWORN.IMPACT.${capitalize(impact)}`
				)
				const params = { impact: `<b>${i18nImpact}</b>` }
				// TODO: use "impact" if this is an SF character
				if (newValue)
					return game.i18n.format('IRONSWORN.ChatAlert.MarkedImpact', params)
				return game.i18n.format('IRONSWORN.ChatAlert.ClearedImpact', params)
			}
		}

		return undefined
	},

	site: (actor: IronswornActor, data) => {
		const siteData = actor.system as SiteDataPropertiesData

		if (data.system?.rank) {
			const oldRank = game.i18n.localize(RANKS[siteData.rank])
			const newRank = game.i18n.localize(RANKS[data.system.rank])
			return game.i18n.format('IRONSWORN.ChatAlert.RankChanged', {
				old: oldRank,
				new: newRank
			})
		}
		if (data.system?.current !== undefined) {
			const advanced = data.system.current > siteData.current
			return game.i18n.localize(
				`IRONSWORN.ChatAlert.Progress${advanced ? 'Advanced' : 'Reduced'}`
			)
		}
		return undefined
	}
}

type ItemTypeHandler = (IronswornItem, any) => string | undefined
const ITEM_TYPE_HANDLERS: Record<string, ItemTypeHandler> = {
	progress: (item: IronswornItem, data) => {
		const progressData = item.system as ProgressDataPropertiesData
		if (data.system?.rank) {
			const oldRank = game.i18n.localize(RANKS[progressData.rank])
			const newRank = game.i18n.localize(RANKS[data.system.rank])
			return game.i18n.format('IRONSWORN.ChatAlert.rankChanged', {
				old: oldRank,
				new: newRank
			})
		}
		if (data.system?.current !== undefined) {
			const advanced = data.system.current > progressData.current
			return game.i18n.localize(
				`IRONSWORN.ChatAlert.progress${advanced ? 'Advanced' : 'Reduced'}`
			)
		}
		if (data.system?.clockTicks !== undefined) {
			const change = data.system.clockTicks - progressData.clockTicks
			const advanced = data.system.clockTicks > progressData.clockTicks
			const completed = data.system.clockTicks >= progressData.clockMax
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
				max: progressData.clockMax,
				old: progressData.clockTicks,
				new: data.system.clockTicks
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
	vow: (item, data) => ITEM_TYPE_HANDLERS.progress(item, data),

	asset: (item: IronswornItem, data) => {
		const assetData = item.system as AssetDataPropertiesData
		if (data.system?.abilities !== undefined) {
			const oldEnables = assetData.abilities.map((x) => x.enabled)
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

		if (data.system?.track?.current !== undefined) {
			const newValue = data.system.track.current
			const oldValue = assetData.track.current
			const signPrefix = newValue > oldValue ? '+' : ''
			return game.i18n.format('IRONSWORN.ChatAlert.AdjustedStat', {
				amt: `${signPrefix}${newValue - oldValue}`,
				stat: assetData.track.name,
				val: newValue
			})
		}

		if (data.system?.exclusiveOptions !== undefined) {
			const selectedOption = data.system.exclusiveOptions.find(
				(x) => x.selected
			)
			return game.i18n.format('IRONSWORN.ChatAlert.MarkedOption', {
				name: selectedOption.name
			})
		}

		if (data.system?.fields !== undefined) {
			for (let i = 0; i < data.system.fields.length; i++) {
				const newField = data.system.fields[i]
				const oldField = assetData.fields[i]
				if (oldField && oldField?.value !== newField.value) {
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

	bondset: (item: IronswornItem, data) => {
		const bondsetData = item.system as BondsetDataPropertiesData
		if (data.system?.bonds !== undefined) {
			const oldLen = Object.values(bondsetData.bonds).length
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

async function sendToChat(speaker: IronswornActor, msg: string) {
	const whisperToCurrentUser =
		speaker.getFlag('foundry-ironsworn', 'muteBroadcast') ?? (false as boolean)
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
