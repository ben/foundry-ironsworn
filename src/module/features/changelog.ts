import { ChatMessageDataConstructorData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/chatMessageData'
import { IronswornActor } from '../actor/actor'
import { RANKS } from '../constants'
import { IronswornItem } from '../item/item'
import { ProgressDataProperties } from '../item/itemtypes'

export function activateChangelogListeners() {
  Hooks.on('preUpdateActor', async (actor: IronswornActor, data: any, _options: Entity.UpdateOptions, _userId: number) => {
    // Log updates to base stats, resource trackers, and debilities
    const content = Object.entries(data.data)
      .map((val) => `${val[0]}: ${val[1]}`)
      .join('\n')

    for (const k of Object.keys(data.data)) {
      console.log(`Actor: ${actor.data.data[k]}, data: ${data.data[k]}`)
    }

    const messageData: ChatMessageDataConstructorData = {
      content,
      type: CONST.CHAT_MESSAGE_TYPES.EMOTE,
      speaker: { actor: actor.id },
    }

    const cls = CONFIG.ChatMessage.documentClass
    return cls.create(messageData as any, {})
  })

  Hooks.on('preUpdateItem', async (item: IronswornItem, data: any, _options: Entity.UpdateOptions, _userId: number) => {
    if (!item.parent) return // No logging for unowned items, they don't matter

    let content: string | undefined
    if (data.name) {
      content = `renamed to '${data.name}'`
    } else if (data.img) {
      content = `updated image`
    } else {
      content = itemTypeHandlers[item.type]?.(item, data)
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

type ItemTypeHandler = (IronswornItem, any) => string

const itemTypeHandlers: { [key: string]: ItemTypeHandler } = {
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
    return JSON.stringify(data, null, 2)
  },
  vow: (item, data) => itemTypeHandlers.progress(item, data),

  asset: (item: IronswornItem, data) => {
    return JSON.stringify(data)
  }
}
