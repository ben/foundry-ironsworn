import { ChatMessageDataConstructorData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/chatMessageData'
import { compact, get } from 'lodash'
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

function stringifyProgress(ticks: number) {
  // TODO: consider providing this as a string of progress mark icons (it'll still need this text for annotation tho)
  const ticksPerBox = 4
  const and = game.i18n.localize('and')
  const boxes = ticks % ticksPerBox
  const remainderTicks = ticks - boxes * ticksPerBox
  let boxString
  let ticksString
  if (boxes > 0) {
    if (boxes > 3) {
      boxString = game.i18n.format('IRONSWORN.PROGRESS.BOX.Many', {
        number: boxes,
      })
    } else {
      boxString = game.i18n.localize(`IRONSWORN.PROGRESS.BOX.${boxes}`)
    }
  }
  if (remainderTicks > 0) {
    ticksString = game.i18n.localize(
      `IRONSWORN.PROGRESS.TICKS.${remainderTicks}`
    )
  }

  return compact([boxString, ticksString]).join(` ${and} `)
}

enum ResourceKeys {
  health = 'IRONSWORN.RESOURCE.HEALTH',
  spirit = 'IRONSWORN.RESOURCE.SPIRIT',
  supply = 'IRONSWORN.RESOURCE.SUPPLY',
  momentum = 'IRONSWORN.RESOURCE.MOMENTUM',
}

export enum DebilityKeys {
  corrupted = 'IRONSWORN.DEBILITY.CORRUPTED',
  encumbered = 'IRONSWORN.DEBILITY.ENCUMBERED',
  maimed = 'IRONSWORN.DEBILITY.MAIMED',
  shaken = 'IRONSWORN.DEBILITY.SHAKEN',
  tormented = 'IRONSWORN.DEBILITY.TORMENTED',
  unprepared = 'IRONSWORN.DEBILITY.UNPREPARED',
  wounded = 'IRONSWORN.DEBILITY.WOUNDED',
  doomed = 'IRONSWORN.DEBILITY.DOOMED',
}

export enum ImpactKeys {
  cursed = 'IRONSWORN.IMPACT.CURSED',
  shaken = 'IRONSWORN.IMPACT.SHAKEN',
  tormented = 'IRONSWORN.IMPACT.TORMENTED',
  unprepared = 'IRONSWORN.IMPACT.UNPREPARED',
  wounded = 'IRONSWORN.IMPACT.WOUNDED',
  permanentlyharmed = 'IRONSWORN.IMPACT.PERMANENTLY_HARMED',
  traumatized = 'IRONSWORN.IMPACT.TRAUMATIZED',
  doomed = 'IRONSWORN.IMPACT.DOOMED',
  indebted = 'IRONSWORN.IMPACT.INDEBTED',
  battered = 'IRONSWORN.IMPACT.BATTERED',
}

type ActorTypeHandler = (IronswornActor, any) => string | undefined

export function registerChatAlertHooks() {
  Hooks.on(
    'preUpdateActor',
    async (actor: IronswornActor, data: any, options, _userId: number) => {
      if (!IronswornSettings.logCharacterChanges) return
      if (options.suppressLog) return

      let content: string | undefined
      if (data.name) {
        content = game.i18n.format('IRONSWORN.GENERIC.RENAME.Alert', {
          oldName: actor.name,
          newName: data.name,
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
        content = game.i18n.format('IRONSWORN.GENERIC.RENAME.Alert', {
          oldName: item.name,
          newName: data.name,
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
        game.i18n.format('IRONSWORN.GENERIC.ADD.Alert', { name: item.name })
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
        game.i18n.format('IRONSWORN.GENERIC.DELETE.Alert', {
          name: item.name,
        })
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
        return game.i18n.format('IRONSWORN.EXPERIENCE.MARK.Alert', {
          number: newXp - oldXp,
        })
      } else {
        return game.i18n.format('IRONSWORN.EXPERIENCE.CLEAR.Alert', {
          number: oldXp - newXp,
        })
      }
    }

    // Starforged legacy XP
    for (const kind of ['quests', 'bonds', 'discoveries']) {
      const oldXp = characterData.data.legacies[`${kind}XpSpent`]
      const newXp = get(data.data, `legacies.${kind}XpSpent`)
      if (newXp !== undefined) {
        if (newXp > oldXp) {
          return game.i18n.format('IRONSWORN.EXPERIENCE.SPEND.Alert', {
            number: newXp - oldXp,
          })
        } else {
          return game.i18n.format('IRONSWORN.EXPERIENCE.REFUND.Alert', {
            number: oldXp - newXp,
          })
        }
      }
    }

    for (const meter of ['momentum', 'health', 'spirit', 'supply']) {
      const newValue = get(data.data, meter)
      if (newValue !== undefined) {
        const oldValue = get(characterData.data, meter)
        const isSuffer = oldValue > newValue
        const attr = game.i18n.localize(`${ResourceKeys[meter]}.Attr`)
        const formatOptions = { number: newValue - oldValue, attr, newValue }
        const templateKey =
          'IRONSWORN.RESOURCE.' + isSuffer ? 'SUFFER' : 'TAKE' + '.Alert'
        return game.i18n.format(templateKey, formatOptions)
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
          : game.i18n.localize(
              `${
                IronswornSettings.starforgedToolsEnabled
                  ? ImpactKeys[debility]
                  : DebilityKeys[debility]
              }`
            )
        const params = { name: i18nDebility }
        // TODO: use "impact" if this is an SF character
        if (newValue)
          return game.i18n.format('IRONSWORN.GENERIC.MARK.Alert', params)
        return game.i18n.format('IRONSWORN.GENERIC.CLEAR.Alert', params)
      }
    }

    return undefined
  },

  shared: (actor: IronswornActor, data) => {
    const sharedData = actor.data as SharedDataProperties

    if (data.data?.supply !== undefined) {
      const newValue = get(data.data, 'supply')
      const oldValue = get(sharedData.data, 'supply')
      const isSuffer = oldValue > newValue
      const attr = game.i18n.localize('IRONSWORN.RESOURCE.SUPPLY.Attr')
      const formatOptions = { number: newValue - oldValue, attr, newValue }
      const templateKey =
        'IRONSWORN.RESOURCE.' + isSuffer ? 'SUFFER' : 'TAKE' + '.Alert'
      return game.i18n.format(templateKey, formatOptions)
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
          `${
            IronswornSettings.starforgedToolsEnabled
              ? ImpactKeys[debility]
              : DebilityKeys[debility]
          }`
        )
        const params = { name: i18nDebility }
        // TODO: use "impact" if this is an SF character
        if (newValue)
          return game.i18n.format('IRONSWORN.GENERIC.MARKED.Alert', params)
        return game.i18n.format('IRONSWORN.GENERIC.CLEARED.Alert', params)
      }
    }

    return undefined
  },

  site: (actor: IronswornActor, data: Partial<SiteDataProperties>) => {
    const siteData = actor.data as SiteDataProperties

    if (data.data?.rank) {
      const oldAttr = game.i18n.localize(RANKS[siteData.data.rank] + '.Attr')
      const newAttr = game.i18n.localize(RANKS[data.data.rank] + '.Attr')
      return game.i18n.format('IRONSWORN.PROGRESS.CHALLEGE_RANK.SET.Alert', {
        oldAttr,
        newAttr,
      })
    }
    if (data.data?.current !== undefined) {
      const advanced = data.data.current > siteData.data.current
      return game.i18n.format(
        `IRONSWORN.PROGRESS.${advanced ? 'MARK' : 'CLEAR'}.Alert`,
        {}
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
      const oldAttr = game.i18n.localize(
        RANKS[progressData.data.rank] + '.Attr'
      )
      const newAttr = game.i18n.localize(RANKS[data.data.rank] + '.Attr')
      return game.i18n.format('IRONSWORN.PROGRESS.CHALLEGE_RANK.SET.Alert', {
        oldAttr,
        newAttr,
      })
    }
    if (data.data?.current !== undefined) {
      const delta = data.data.current - progressData.data.current
      const isAdvancing = data.data.current > progressData.data.current
      const currentScore = data.data.current % 4
      const deltaString = stringifyProgress(Math.abs(delta))
      return game.i18n.format(
        `IRONSWORN.PROGRESS.${isAdvancing ? 'MARK' : 'CLEAR'}.Alert`,
        { amount: deltaString, currentScore }
      )
    }
    if (data.data?.clockTicks !== undefined) {
      const change = data.data.clockTicks - progressData.data.clockTicks
      const isAdvancing = data.data.clockTicks > progressData.data.clockTicks
      const isCompleting = data.data.clockTicks >= progressData.data.clockMax
      const newValue = data.data.clockTicks
      const oldValue = progressData.data.clockTicks
      const maxValue = progressData.data.clockMax
      let i18nKey = 'IRONSWORN.CLOCK'
      switch (true) {
        case isCompleting: {
          i18nKey += '.COMPLETE.ALERT'
          break
        }
        case isAdvancing: {
          i18nKey += '.ADVANCE.ALERT'
          break
        }
        default: {
          i18nKey += '.SET.Alert'
          return game.i18n.format(i18nKey, { newValue, maxValue })
        }
      }
      if (change > 2) {
        i18nKey += '.Many'
      } else {
        i18nKey += `.${change}`
      }
      return game.i18n.format(i18nKey, {
        change,
        maxValue,
        oldValue,
        newValue,
      })
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
          if (newEnables[i])
            return game.i18n.format('IRONSWORN.ASSET.ABILITY.MARK.Alert', {
              number: i + 1,
            })
          return game.i18n.format('IRONSWORN.ASSET.ABILITY.CLEAR.Alert', {
            number: i + 1,
          })
        }
      }
    }

    if (data.data?.track?.current !== undefined) {
      const newValue = data.data.track.current
      const oldValue = assetData.data.track.current
      const isSuffer = newValue > oldValue
      const formatOptions = {
        number: newValue - oldValue,
        attr: data.data.track.name,
        newValue,
      }
      const templateKey =
        'IRONSWORN.RESOURCE.' + isSuffer ? 'SUFFER' : 'TAKE' + '.Alert'
      return game.i18n.format(templateKey, formatOptions)
    }

    if (data.data?.exclusiveOptions !== undefined) {
      const selectedOption = data.data.exclusiveOptions.find((x) => x.selected)
      return game.i18n.format('IRONSWORN.GENERIC.MARK.Alert', {
        name: selectedOption.name,
      })
    }

    if (data.data?.fields !== undefined) {
      for (let i = 0; i < data.data.fields.length; i++) {
        const newField = data.data.fields[i]
        const oldField = assetData.data.fields[i]
        if (oldField && oldField?.value !== newField.value) {
          return game.i18n.format('IRONSWORN.GENERIC.EDIT.Alert', {
            name: newField.name,
            value: newField.value,
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
        return game.i18n.localize('IRONSWORN.BOND.ADD.Alert')
      } else if (newLen < oldLen) {
        return game.i18n.localize('IRONSWORN.BOND.DELETE.Alert')
      }
    }

    return undefined
  },
}

function sendToChat(actor: IronswornActor, msg: string) {
  const messageData: ChatMessageDataConstructorData = {
    content: `<i>${msg}</i>`,
    type: CONST.CHAT_MESSAGE_TYPES.EMOTE,
    speaker: { actor: actor.id },
  }

  const cls = CONFIG.ChatMessage.documentClass
  return cls.create(messageData as any)
}
