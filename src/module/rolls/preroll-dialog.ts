import { capitalize } from 'lodash'
import { IronswornActor } from '../actor/actor'
import { IronswornSettings } from '../helpers/settings'
import { IronswornItem } from '../item/item'
import { IronswornRoll, PreRollOptions } from './roll'

interface IronswornRollDalogOptions {}

type Buttons = Record<
  string,
  {
    label: string
    icon: string
  }
>

export class IronswornPrerollDialog extends Dialog {
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ['ironsworn', 'dialog', `theme-${IronswornSettings.theme}`],
      width: 500,
      resizable: true,
    })
  }

  static async showForStat(name: string, value: number) {
    const rollText = game.i18n.localize('IRONSWORN.Roll')
    const statText = game.i18n.localize(`IRONSWORN.${capitalize(name)}`)
    const title = `${rollText} +${statText}`

    const prerollOpts = {
      action: {
        stat: {
          source: name,
          value,
        },
      },
    }

    const content = await this.renderContent({ prerollOpts, action: true })
    const buttons = {
      [name]: {
        label: statText,
        icon: '<i class="isicon-d10-tilt juicy"></i>',
        callback: (el: HTMLElement | JQuery<HTMLElement>) => {
          IronswornPrerollDialog.submitRoll(el, prerollOpts)
        },
      },
    }
    return new IronswornPrerollDialog({
      title,
      content,
      buttons,
      default: name,
    }).render(true)
  }

  static async showForProgress(name: string, value: number) {
    const rollText = game.i18n.localize('IRONSWORN.ProgressRoll')
    const title = `${rollText}: ${name}`

    const prerollOpts: PreRollOptions = {
      progress: {
        source: name,
        value,
      },
    }

    const content = await this.renderContent({ prerollOpts })
    const buttons = {
      [name]: {
        label: game.i18n.localize('IRONSWORN.Roll'),
        icon: '<i class="isicon-d10-tilt juicy"></i>',
        callback: (el: HTMLElement | JQuery<HTMLElement>) => {
          IronswornPrerollDialog.submitRoll(el, prerollOpts)
        },
      },
    }
    return new IronswornPrerollDialog({
      title,
      content,
      buttons,
      default: name,
    }).render(true)
  }

  static showForMove(move: IronswornItem, actor: IronswornActor) {}

  private static submitRoll(
    el: HTMLElement | JQuery<HTMLElement>,
    opts: PreRollOptions
  ) {
    const form = el[0].querySelector('form')
    console.log(form, opts)

    // Manual adds; only for action rolls
    if (opts.action) {
      opts.action.adds = parseInt(form.adds.value || '0', 10)
    }

    if (form.automaticOutcome.checked) {
      opts.automaticOutcome = {
        source: 'set manually',
        value: form.automaticOutcomeValue.value,
      }
    }
    if (form.presetActionDie.checked) {
      opts.presetActionDie = {
        source: 'set manually',
        value: parseInt(form.presetActionDieValue.value || '0'),
      }
    }
    if (form.extraChallengeDice.checked) {
      opts.extraChallengeDice = {
        source: 'set manually',
        value: parseInt(form.extraChallengeDiceValue.value || '0'),
      }
    }

    const r = new IronswornRoll()
    r.preRollOptions = opts
    return r.createOrUpdateChatMessage()
  }

  private static renderContent(data: any) {
    const template =
      'systems/foundry-ironsworn/templates/rolls/preroll-dialog.hbs'
    return renderTemplate(template, data)
  }
}
