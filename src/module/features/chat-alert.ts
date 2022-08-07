import { ChatMessageDataConstructorData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/chatMessageData'
import { capitalize, get } from 'lodash'
import { IronswornActor } from '../actor/actor'
import {
  CharacterDataProperties,
  SharedDataProperties,
  SiteDataProperties,
  StarshipDataProperties,
} from '../actor/actortypes'
import { RANKS } from '../constants'
import { IronswornSettings } from '../helpers/settings'
import { IronswornItem } from '../item/item'
import {
  AssetDataProperties,
  BondsetDataProperties,
  ProgressDataProperties,
} from '../item/itemtypes'

type ActorTypeHandler = (IronswornActor, any) => string | undefined

export function registerChatAlertHooks() {
  Hooks.on(
    'preUpdateActor',
    async (actor: IronswornActor, data: any, options, _userId: number) => {
      if (!IronswornSettings.logCharacterChanges) return
      if (options.suppressLog) return

      let content: string | undefined
      if (data.name) {
        content = game.i18n.format('IRONSWORN.ChatAlert.Renamed', {
          name: data.name,
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
      if (!IronswornSettings.logCharacterChanges) return
      if (!item.parent) return // No logging for unowned items, they don't matter

      let content: string | undefined
      if (data.name) {
        content = game.i18n.format('IRONSWORN.ChatAlert.renamed', {
          name: data.name,
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
      if (!IronswornSettings.logCharacterChanges) return
      if (!item.parent) return // No logging for unowned items, they don't matter
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
      if (!IronswornSettings.logCharacterChanges) return
      if (!item.parent) return // No logging for unowned items, they don't matter
      if (options.suppressLog) return

      sendToChat(
        item.parent,
        game.i18n.format('IRONSWORN.ChatAlert.Deleted', { name: item.name })
      )
    }
  )
}

const ACTOR_TYPE_HANDLERS: { [key: string]: ActorTypeHandler } = {
  character: (actor: IronswornActor, data) => {
    const characterData = actor.data as CharacterDataProperties

    // Ironsworn XP
    if (data.data?.xp !== undefined) {
      const oldXp = characterData.data.xp
      const newXp = data.data.xp as number
      if (newXp > oldXp) {
        return game.i18n.format('IRONSWORN.ChatAlert.MarkedXP', {
          amt: newXp - oldXp,
        })
      } else {
        return game.i18n.format('IRONSWORN.ChatAlert.UnmarkedXP', {
          amt: oldXp - newXp,
        })
      }
    }

    // Starforged legacy XP
    for (const kind of ['quests', 'bonds', 'discoveries']) {
      const oldXp = characterData.data.legacies[`${kind}XpSpent`]
      const newXp = get(data.data, `legacies.${kind}XpSpent`)
      if (newXp !== undefined) {
        if (newXp > oldXp) {
          return game.i18n.format('IRONSWORN.ChatAlert.MarkedXP', {
            amt: newXp - oldXp,
          })
        } else {
          return game.i18n.format('IRONSWORN.ChatAlert.UnmarkedXP', {
            amt: oldXp - newXp,
          })
        }
      }
    }

    for (const stat of ['momentum', 'health', 'spirit', 'supply']) {
      const newValue = get(data.data, stat)
      if (newValue !== undefined) {
        const oldValue = get(characterData.data, stat)
        const signPrefix = newValue > oldValue ? '+' : ''
        const i18nStat = game.i18n.localize(`IRONSWORN.${capitalize(stat)}`)
        return game.i18n.format('IRONSWORN.ChatAlert.AdjustedStat', {
          amt: `${signPrefix}${newValue - oldValue}`,
          stat: i18nStat,
          val: newValue,
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
      'custom2',
    ]
    for (const debility of debilities) {
      const newValue = get(data.data?.debility, debility)
      if (newValue !== undefined) {
        const oldValue = characterData.data.debility[debility]
        if (oldValue === newValue) continue
        const i18nDebility = debility.startsWith('custom')
          ? get(characterData.data.debility, `${debility}name`)
          : game.i18n.localize(`IRONSWORN.${capitalize(debility)}`)
        const params = { condition: i18nDebility }
        // TODO: use "impact" if this is an SF character
        if (newValue)
          return game.i18n.format('IRONSWORN.ChatAlert.SetCondition', params)
        return game.i18n.format('IRONSWORN.ChatAlert.ClearedCondition', params)
      }
    }

    return undefined
  },

  shared: (actor: IronswornActor, data) => {
    const sharedData = actor.data as SharedDataProperties

    if (data.data?.supply !== undefined) {
      const newValue = data.data.supply
      const oldValue = sharedData.data.supply
      const signPrefix = newValue > oldValue ? '+' : ''
      const i18nStat = game.i18n.localize('IRONSWORN.Supply')
      return game.i18n.format('IRONSWORN.ChatAlert.AdjustedStat', {
        amt: `${signPrefix}${newValue - oldValue}`,
        stat: i18nStat,
        val: newValue,
      })
    }

    return undefined
  },

  starship: (actor: IronswornActor, data) => {
    const starshipData = actor.data as StarshipDataProperties
    const debilities = ['cursed', 'battered']
    for (const debility of debilities) {
      const newValue = get(data.data?.debility, debility)
      if (newValue !== undefined) {
        const oldValue = starshipData.data.debility[debility]
        if (oldValue === newValue) continue
        const i18nDebility = game.i18n.localize(
          `IRONSWORN.${capitalize(debility)}`
        )
        const params = { condition: i18nDebility }
        // TODO: use "impact" if this is an SF character
        if (newValue)
          return game.i18n.format('IRONSWORN.ChatAlert.SetCondition', params)
        return game.i18n.format('IRONSWORN.ChatAlert.ClearedCondition', params)
      }
    }

    return undefined
  },

  site: (actor: IronswornActor, data) => {
    const siteData = actor.data as SiteDataProperties

    if (data.data?.rank) {
      const oldRank = game.i18n.localize(RANKS[siteData.data.rank])
      const newRank = game.i18n.localize(RANKS[data.data.rank])
      return game.i18n.format('IRONSWORN.ChatAlert.RankChanged', {
        old: oldRank,
        new: newRank,
      })
    }
    if (data.data?.current !== undefined) {
      const advanced = data.data.current > siteData.data.current
      return game.i18n.localize(
        `IRONSWORN.ChatAlert.Progress${advanced ? 'Advanced' : 'Reduced'}`
      )
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
      return game.i18n.format('IRONSWORN.ChatAlert.rankChanged', {
        old: oldRank,
        new: newRank,
      })
    }
    if (data.data?.current !== undefined) {
      const advanced = data.data.current > progressData.data.current
      return game.i18n.localize(
        `IRONSWORN.ChatAlert.progress${advanced ? 'Advanced' : 'Reduced'}`
      )
    }
    if (data.data?.clockTicks !== undefined) {
      const change = data.data.clockTicks - progressData.data.clockTicks
      const advanced = data.data.clockTicks > progressData.data.clockTicks
      const completed = data.data.clockTicks >= progressData.data.clockMax
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
        max: progressData.data.clockMax,
        old: progressData.data.clockTicks,
        new: data.data.clockTicks,
      })
    }
    if (data.data?.completed !== undefined) {
      return game.i18n.localize(
        `IRONSWORN.ChatAlert.completed${
          data.data?.completed ? 'Marked' : 'Unmarked'
        }`
      )
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
          const descriptors = ['First', 'Second', 'Third', 'Fourth', 'Fifth']
          const pos = game.i18n.localize(`IRONSWORN.${descriptors[i]}`)
          if (newEnables[i])
            return game.i18n.format('IRONSWORN.ChatAlert.MarkedAbility', {
              pos,
            })
          return game.i18n.format('IRONSWORN.ChatAlert.UnmarkedAbility', {
            pos,
          })
        }
      }
    }

    if (data.data?.track?.current !== undefined) {
      const newValue = data.data.track.current
      const oldValue = assetData.data.track.current
      const signPrefix = newValue > oldValue ? '+' : ''
      return game.i18n.format('IRONSWORN.ChatAlert.AdjustedStat', {
        amt: `${signPrefix}${newValue - oldValue}`,
        stat: assetData.data.track.name,
        val: newValue,
      })
    }

    if (data.data?.exclusiveOptions !== undefined) {
      const selectedOption = data.data.exclusiveOptions.find((x) => x.selected)
      return game.i18n.format('IRONSWORN.ChatAlert.MarkedOption', {
        name: selectedOption.name,
      })
    }

    if (data.data?.fields !== undefined) {
      for (let i = 0; i < data.data.fields.length; i++) {
        const newField = data.data.fields[i]
        const oldField = assetData.data.fields[i]
        if (oldField && oldField?.value !== newField.value) {
          return game.i18n.format('IRONSWORN.ChatAlert.SetField', {
            name: newField.name,
            val: newField.value,
          })
        }
      }
    }
    return undefined
  },

  bondset: (item: IronswornItem, data) => {
    const bondsetData = item.data as BondsetDataProperties
    if (data.data?.bonds !== undefined) {
      const oldLen = Object.values(bondsetData.data.bonds).length
      const newLen = Object.values(data.data.bonds).length
      if (oldLen < newLen) {
        return game.i18n.localize('IRONSWORN.ChatAlert.AddBond')
      } else if (newLen < oldLen) {
        return game.i18n.localize('IRONSWORN.ChatAlert.LostBond')
      }
    }

    return undefined
  },
}

function sendToChat(actor: IronswornActor, msg: string) {
  const messageData: ChatMessageDataConstructorData = {
    content: `<em>${msg}</em>`,
    type: CONST.CHAT_MESSAGE_TYPES.EMOTE,
    speaker: { actor: actor.id },
  }

  const cls = CONFIG.ChatMessage.documentClass
  return cls.create(messageData as any)
}
