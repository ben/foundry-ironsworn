import { IronswornActor } from '../actor/actor'
import { IronswornItem } from '../item/item'
import { SFMoveDataProperties } from '../item/itemtypes'
import { IronswornSettings } from './settings'

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
    if (!data.data.Trigger.Options?.length) {
      return createDataforgedMoveChat(move)
    }

    const template = 'systems/foundry-ironsworn/templates/sf-move-roll-dialog.hbs'
    const renderOpts = { actor, move }
    const content = await renderTemplate(template, renderOpts)

    const title = move.name || 'MOVE'
    const buttons = {}
    const addButton = (i: number, mode: string, stats: string[]) => {
      const label = mode === 'Stat' ? stats[0] : `${mode} ${stats.join(', ')}`
      buttons[i.toString()] = {
        label,
        icon: '<i class="fas fa-dice-d6"></i>',
        callback: callback(actor, move, mode, stats),
      }
    }

    const options = data.data.Trigger.Options ?? []
    for (let i = 0; i < options.length; i++) {
      const option = options[i]
      const regularRolls = option['Action roll'] ?? option['Progress roll']
      if (regularRolls?.['All of']) {
        addButton(i, 'All of', regularRolls['All of'])
      }
      if (regularRolls?.['Best of']) {
        addButton(i, 'Best of', regularRolls['Best of'])
      }
      if (regularRolls?.['Worst of']) {
        addButton(i, 'Worst of', regularRolls['Worst of'])
      }
      if (option['Action roll']?.Stat) {
        addButton(i, 'Stat', [option['Action roll'].Stat])
      }
    }

    return new SFRollMoveDialog({
      title,
      content,
      buttons,
      default: '0',
    }).render(true)
  }
}
function callback(actor: IronswornActor, move: IronswornItem, mode: string, stats: string[]) {
  return async (x) => {
    // TODO: extract data from form and send to rollAndCreateChatMessage
    const form = x[0].querySelector('form')
    const bonus = form.bonus.value ? parseInt(form.bonus.value ?? '0', 10) : 0
    rollAndCreateChatMessage(actor, move, mode, stats, bonus)
  }
}

async function rollAndCreateChatMessage(actor: IronswornActor, move: IronswornItem, mode: string, stats: string[], bonus: number) {
  console.log({actor, move, mode, stats, bonus})
}

async function createDataforgedMoveChat(move: IronswornItem) {
  const content = await renderTemplate('systems/foundry-ironsworn/templates/chat/sf-move.hbs', { move })
  ChatMessage.create({
    speaker: ChatMessage.getSpeaker(),
    content,
  })
}
