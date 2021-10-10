import { ChatMessageDataConstructorData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/chatMessageData'
import { capitalize, get } from 'lodash'
import { IronswornActor } from '../actor/actor'
import { CharacterDataProperties, SiteDataProperties } from '../actor/actortypes'
import { RANKS } from '../constants'
import { IronswornItem } from '../item/item'
import { AssetDataProperties, BondsetDataProperties, ProgressDataProperties } from '../item/itemtypes'

export function activateChangelogListeners() {
  Hooks.on('preUpdateActor', async (actor: IronswornActor, data: any, options: Entity.UpdateOptions, _userId: number) => {
    if (options.suppressLog) return

    let content: string | undefined
    if (data.name) {
      content = `Renamed to '${data.name}'`
    } else if (data.img) {
      content = `Updated image`
    } else {
      content = ACTOR_TYPE_HANDLERS[actor.type]?.(actor, data)
      if (!content) return
    }

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

    const itemName = item.type === 'bondset' ? '' : item.name
    const messageData: ChatMessageDataConstructorData = {
      content: `<em>${itemName} ${content}</em>`,
      type: CONST.CHAT_MESSAGE_TYPES.EMOTE,
      speaker: { actor: item.parent.id },
    }

    const cls = CONFIG.ChatMessage.documentClass
    return cls.create(messageData as any)
  })

  Hooks.on('createItem', async (item: IronswornItem, options: Entity.CreateOptions, _userId: number) => {
    if (!item.parent) return // No logging for unowned items, they don't matter
    if (options.suppressLog) return

    const messageData: ChatMessageDataConstructorData = {
      content: `<em>Added ${item.name}</em>`,
      type: CONST.CHAT_MESSAGE_TYPES.EMOTE,
      speaker: { actor: item.parent.id },
    }

    const cls = CONFIG.ChatMessage.documentClass
    return cls.create(messageData as any)
  })

  Hooks.on('deleteItem', async (item: IronswornItem, options: Entity.DeleteOptions, _userId: number) => {
    if (!item.parent) return // No logging for unowned items, they don't matter
    if (options.suppressLog) return

    const messageData: ChatMessageDataConstructorData = {
      content: `<em>Deleted ${item.name}</em>`,
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

  site: (actor: IronswornActor, data) => {
    const siteData = actor.data as SiteDataProperties

    if (data.data?.rank) {
      const oldRank = game.i18n.localize(RANKS[siteData.data.rank])
      const newRank = game.i18n.localize(RANKS[data.data.rank])
      return `Rank changed from ${oldRank} to ${newRank}`
    }
    if (data.data?.current !== undefined) {
      return `Progress ${data.data.current > siteData.data.current ? 'advanced' : 'reduced'}`
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
    const assetData = item.data as AssetDataProperties
    if (data.data?.abilities !== undefined) {
      const oldEnables = assetData.data.abilities.map((x) => x.enabled)
      const newEnables = data.data.abilities.map((x) => x.enabled)
      for (let i = 0; i < oldEnables.length; i++) {
        if (oldEnables[i] !== newEnables[i]) {
          const descriptors = ['first', 'second', 'third', 'fourth', 'fifth']
          return `${newEnables[i] ? 'marked' : 'unmarked'} ${descriptors[i]} ability`
        }
      }
    }

    if (data.data?.track?.current !== undefined) {
      const newValue = data.data.track.current
      const oldValue = assetData.data.track.current
      const signPrefix = newValue > oldValue ? '+' : ''
      return `${signPrefix}${newValue - oldValue} ${assetData.data.track.name} (now ${newValue})`
    }

    if (data.data?.exclusiveOptions !== undefined) {
      const selectedOption = data.data.exclusiveOptions.find((x) => x.selected)
      return `marked ${selectedOption.name}`
    }

    if (data.data?.fields !== undefined) {
      for (let i = 0; i < data.data.fields.length; i++) {
        const newField = data.data.fields[i]
        const oldField = assetData.data.fields[i]
        if (oldField && oldField?.value !== newField.value) {
          return `set ${newField.name} to ${newField.value}`
        }
      }
    }
    return undefined
  },

  bondset: (item: IronswornItem, data) => {
    const bondsetData = item.data as BondsetDataProperties
    if (data.data?.bonds !== undefined) {
      if (bondsetData.data.bonds.length < data.data.bonds.length) {
        return `Added a bond`
      } else {
        return `Lost a bond`
      }
    }

    return undefined
  },
}
