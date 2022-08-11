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
    })
  }

  static async showForStat(name: string, value: number) {
    const rollText = game.i18n.localize('IRONSWORN.Roll')
    const statText = game.i18n.localize(`IRONSWORN.${capitalize(name)}`)
    const title = `${rollText} +${statText}`

    const propts = {
      action: {
        stat: {
          source: name,
          value,
        },
      },
    }

    const content = await this.renderContent({ action: true })
    const buttons = {
      [name]: {
        label: statText,
        icon: '<i class="isicon-d10-tilt juicy"></i>',
        callback: (el: HTMLElement | JQuery<HTMLElement>) => {
          IronswornPrerollDialog.submitRoll(el, propts)
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

    const propts: PreRollOptions = {
      progress: {
        source: name,
        value,
      },
    }

    const content = await this.renderContent({})
    const buttons = {
      [name]: {
        label: game.i18n.localize('IRONSWORN.Roll'),
        icon: '<i class="isicon-d10-tilt juicy"></i>',
        callback: (el: HTMLElement | JQuery<HTMLElement>) => {
          IronswornPrerollDialog.submitRoll(el, propts)
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
    // Manual adds; only for action rolls
    if (opts.action) {
      const form = el[0].querySelector('form')
      opts.action.adds = parseInt(form.adds.value || '0', 10)
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
