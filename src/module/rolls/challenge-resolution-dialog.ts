import { IronswornRollMessage } from '.'
import { IronswornSettings } from '../helpers/settings'

export async function showChallengeResolutionDialog(messageId: string) {
  const msg = await IronswornRollMessage.fromMessage(messageId)
  if (!msg) return

  // Bail if the roll is fully resolved
  if (!msg.roll.preRollOptions.extraChallengeDice) return
  const { replacedChallenge1, replacedChallenge2 } = msg.roll.postRollOptions
  if (replacedChallenge1 && replacedChallenge2) return

  // Render the dialog
}

export class ChallengeResolutionDialog extends Dialog {
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ['ironsworn', 'dialog', `theme-${IronswornSettings.theme}`],
      width: 300,
    })
  }

  static async showForMessage(messageId: string) {
    const msg = await IronswornRollMessage.fromMessage(messageId)
    if (!msg) return

    // Bail if the roll is fully resolved
    if (!msg.roll.preRollOptions.extraChallengeDice) return
    const { replacedChallenge1, replacedChallenge2 } = msg.roll.postRollOptions
    if (replacedChallenge1 && replacedChallenge2) return

    // Render the dialog
    const template =
      'systems/foundry-ironsworn/templates/rolls/challenge-resolution-dialog.hbs'
    const renderData = {
      msg,
      dice: msg.roll.rawChallengeDiceValues!.map((x) => ({
        value: x,
        minmax: x === 1 ? 'min' : x === 10 ? 'max' : undefined,
      })),
    }
    const content = await renderTemplate(template, renderData)
    const buttons = {
      save: { label: 'Commit' },
    }
    return new ChallengeResolutionDialog({
      title: 'Challenge Dice',
      content,
      buttons,
      default: 'save',
    }).render(true)
  }

  activateListeners(html: JQuery<HTMLElement>): void {
    super.activateListeners(html)

    html.find('input:radio').on('change', console.log)
  }
}
