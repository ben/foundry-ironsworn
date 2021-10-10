import { ChatMessageDataConstructorData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/chatMessageData'
import { capitalize, get } from 'lodash'
import { IronswornActor } from '../actor/actor'
import { CharacterDataProperties } from '../actor/actortypes'
import { RANKS } from '../constants'
import { IronswornItem } from '../item/item'
import { AssetDataProperties, ProgressDataProperties } from '../item/itemtypes'

export function activateChangelogListeners() {
  Hooks.on('preUpdateActor', async (actor: IronswornActor, data: any, _options: Entity.UpdateOptions, _userId: number) => {
    let content: string | undefined
    if (data.name) {
      content = `renamed to '${data.name}'`
    } else if (data.img) {
      content = `updated image`
    } else {
      content = ACTOR_TYPE_HANDLERS[actor.type]?.(actor, data)
    }
    if (!content) return

    const messageData: ChatMessageDataConstructorData = {
      content: `<em>${content}</em>`,
      type: CONST.CHAT_MESSAGE_TYPES.EMOTE,
      speaker: { actor: actor.id },
    }

    const cls = CONFIG.ChatMessage.documentClass
    return cls.create(messageData as any)
  })

  Hooks.on('preUpdateItem', async (item: IronswornItem, data: any, _options: Entity.UpdateOptions, _userId: number) => {
    if (!item.parent) return // No logging for unowned items, they don't matter

    let content: string | undefined
    if (data.name) {
      content = `renamed to '${data.name}'`
    } else if (data.img) {
      content = `updated image`
    } else {
      content = ITEM_TYPE_HANDLERS[item.type]?.(item, data)
    }
    if (!content) return

    const messageData: ChatMessageDataConstructorData = {
      content: `<em>${item.name} ${content}</em>`,
      type: CONST.CHAT_MESSAGE_TYPES.EMOTE,
      speaker: { actor: item.parent.id },
    }

    const cls = CONFIG.ChatMessage.documentClass
    return cls.create(messageData as any)
  })
}

type ActorTypeHandler = (IronswornActor, any) => string | undefined
const ACTOR_TYPE_HANDLERS: { [key: string]: ActorTypeHandler } = {
  character: (actor: IronswornActor, data) => {
    const characterData = actor.data as CharacterDataProperties
    if (data.data?.xp !== undefined) {
      const oldXp = characterData.data.xp
      const newXp = data.data.xp as number
      if (newXp > oldXp) {
        return `Marked ${newXp - oldXp} xp`
      } else {
        return `Unmarked ${oldXp - newXp} xp`
      }
    }

    for (const stat of ['momentum', 'health', 'spirit', 'supply']) {
      const newValue = get(data.data, stat)
      if (newValue) {
        const oldValue = get(characterData.data, stat)
        const signPrefix = newValue > oldValue ? '+' : ''
        const i18nStat = game.i18n.localize(`IRONSWORN.${capitalize(stat)}`)
        return `${signPrefix}${newValue - oldValue} ${i18nStat} (now ${newValue})`
      }
    }

    for (const debility of ['corrupted', 'cursed', 'encumbered', 'maimed', 'shaken', 'tormented', 'unprepared', 'wounded']) {
      const newValue = get(data.data.debility, debility)
      if (newValue !== undefined) {
        const oldValue = characterData.data.debility[debility]
        if (oldValue === newValue) continue
        const i18nDebility = game.i18n.localize(`IRONSWORN.${capitalize(debility)}`)
        return `${newValue ? 'Set' : 'Cleared'} the ${i18nDebility} condition`
      }
    }

    return undefined
  },
}

type ItemTypeHandler = (IronswornItem, any) => string | undefined
const ITEM_TYPE_HANDLERS: { [key: string]: ItemTypeHandler } = {
  progress: (item: IronswornItem, data) => {
    const progressData = item.data as ProgressDataProperties
    if (data.data?.rank) {
      const oldRank = game.i18n.localize(RANKS[progressData.data.rank])
      const newRank = game.i18n.localize(RANKS[data.data.rank])
      return `rank changed from ${oldRank} to ${newRank}`
    }
    if (data.data?.current !== undefined) {
      return `progress ${data.data.current > progressData.data.current ? 'advanced' : 'reduced'}`
    }
    return undefined
  },
  vow: (item, data) => ITEM_TYPE_HANDLERS.progress(item, data),

  asset: (item: IronswornItem, data) => {
    return JSON.stringify(data)
  },
}
