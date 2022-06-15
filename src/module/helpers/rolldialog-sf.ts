import { IMoveTrigger } from 'dataforged'
import { maxBy, minBy } from 'lodash'
import { IronswornActor } from '../actor/actor'
import { createStarforgedMoveRollChat, sfNextOracles } from '../chat/chatrollhelpers'
import { IronswornItem } from '../item/item'
import { SFMoveDataProperties } from '../item/itemtypes'
import { IronswornSettings } from './settings'

function rollableOptions(trigger: IMoveTrigger) {
  if (!trigger.Options) return []

  const actionOptions = trigger.Options.filter((x) => x['Roll type'] === 'Action roll')
  if (!actionOptions.length) return []

  const allowedUsings = ['Edge', 'Iron', 'Heart', 'Shadow', 'Wits', 'Health', 'Spirit', 'Supply']
  return actionOptions.filter((x) => (x.Using as string[]).every((u) => allowedUsings.includes(u)))
}

export class SFRollMoveDialog extends Dialog {
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ['ironsworn', 'dialog', `theme-${IronswornSettings.theme}`],
      width: 500,
    })
  }

  static async show(actor: IronswornActor, move: IronswornItem) {
    // Check inputs
    if (move.type !== 'sfmove') {
      throw new Error('this only works with SF moves')
    }

    // Bail out if there's nothing to choose
    const data = move.data as SFMoveDataProperties
    const options = rollableOptions(data.data.Trigger)
    if (!options.length) {
      return this.createDataforgedMoveChat(move)
    }

    const template = 'systems/foundry-ironsworn/templates/sf-move-roll-dialog.hbs'
    const renderOpts = { actor, move }
    const content = await renderTemplate(template, renderOpts)

    const title = move.name || 'MOVE'
    const buttons = {}
    const addButton = (i: number, mode: string, stats: string[]) => {
      // TODO: i18n
      const label = mode === 'Any' ? stats[0] : `${mode} of ${stats.join(', ')}`
      buttons[i.toString()] = {
        label,
        icon: '<i class="isicon-d10-tilt"></i>',
        callback: callback({ actor, move, mode, stats }),
      }
    }

    for (let i = 0; i < options.length; i++) {
      const option = options[i]
      addButton(i, option.Method, option.Using)
    }

    return new SFRollMoveDialog({
      title,
      content,
      buttons,
      default: '0',
    }).render(true)
  }

  static moveHasRollableOptions(move: IronswornItem) {
    const data = move.data as SFMoveDataProperties
    const options = rollableOptions(data.data.Trigger)
    return options.length > 0
  }

  static async createDataforgedMoveChat(move: IronswornItem) {
    const params = {
      move,
      nextOracles: await sfNextOracles(move),
    }
    const content = await renderTemplate('systems/foundry-ironsworn/templates/chat/sf-move.hbs', params)
    ChatMessage.create({
      speaker: ChatMessage.getSpeaker(),
      content,
    })
  }
}

function callback(opts: { actor: IronswornActor; move: IronswornItem; mode: string; stats: string[] }) {
  return async (x) => {
    // TODO: extract data from form and send to rollAndCreateChatMessage
    const form = x[0].querySelector('form')
    const bonus = form.bonus.value ? parseInt(form.bonus.value ?? '0', 10) : 0
    rollAndCreateChatMessage({ ...opts, bonus })
  }
}

// Autofucus on input box when rolling
Hooks.on('renderSFRollMoveDialog', async (_dialog, html, _data) => {
  html.find('input').focus()
})

async function rollAndCreateChatMessage(opts: {
  actor: IronswornActor
  move: IronswornItem
  mode: string
  stats: string[]
  bonus: number
}) {
  const { actor, move, mode, stats, bonus } = opts

  const normalizedStats = stats.map((x) => x.toLowerCase())
  let usedStat = normalizedStats[0]
  if (mode === 'Highest' || mode === 'Lowest') {
    const statMap = {}
    for (const x of normalizedStats) {
      statMap[x] = actor.data.data[x]
    }
    const fn = mode === 'Highest' ? maxBy : minBy
    usedStat = fn(Object.keys(statMap), (x) => statMap[x]) ?? stats[0]
  } else if (mode !== 'Any') {
    console.log({ actor, move, mode, stats, bonus })
    return // TODO: all of
  }

  let actionExpr = 'd6'
  if (usedStat) actionExpr += ` + @${usedStat}`
  if (bonus) actionExpr += ` + ${bonus}`
  const data = {
    ...actor?.getRollData(),
  }

  const roll = new Roll(`{${actionExpr}, d10, d10}`, data)
  createStarforgedMoveRollChat({
    roll,
    actor,
    move,
    mode,
    stats: normalizedStats,
    usedStat,
    bonus,
  })
}
