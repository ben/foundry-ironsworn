import { IronswornActor } from '../actor/actor'
import { createIronswornChatRoll, createIronswornMoveChat } from '../chat/rolls'
import { IronswornItem } from '../item/item'
import { AssetItemData } from '../item/itemtypes'
import { EnhancedDataswornMove } from './data'
import { IronswornSettings } from './settings'
import { capitalize } from './util'

interface RollDialogOptions {
  actor?: IronswornActor
  asset?: Item<AssetItemData>
  move?: EnhancedDataswornMove
  stat?: string
  bonus?: number
}

export class RollDialog extends Dialog {
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ['ironsworn', 'dialog', `theme-${IronswornSettings.theme}`],
      width: 500,
    } as Dialog.Options)
  }

  static async show(opts: RollDialogOptions) {
    // Check inputs
    if (!opts.move && !opts.stat && !(opts.move && opts.stat)) {
      throw new Error('Must provide only one of `move` or `stat`')
    }
    if (opts.stat && opts.bonus !== undefined) {
      // Got everything we need, just roll it
      return this.doRoll(opts)
    }
    if (opts.move && !opts.move.Stats) {
      // Just send the move text to chat
      return createIronswornMoveChat(opts.move)
    }

    // Render content
    const template = 'systems/foundry-ironsworn/templates/roll-dialog.hbs'
    const content = await renderTemplate(template, opts)

    const callbackForStat = (stat: string) => (x) => {
      const form = x[0].querySelector('form')
      const bonus = form.bonus.value ? parseInt(form.bonus.value, 10) : undefined
      this.doRoll({
        ...opts,
        stat,
        bonus,
      })
    }

    const buttons = {}
    let title = ''
    let defaultButton = ''
    if (opts.move) {
      title = opts.move.Name
      defaultButton = opts.move.Stats[0]
      for (const stat of opts.move.Stats) {
        buttons[stat] = {
          icon: '<i class="fas fa-dice-d6"></i>',
          label: game.i18n.localize(`IRONSWORN.${capitalize(stat)}`),
          callback: callbackForStat(stat),
        }
      }
    } else if (opts.stat) {
      const rollText = game.i18n.localize('IRONSWORN.Roll')
      const statText = game.i18n.localize(`IRONSWORN.${capitalize(opts.stat)}`)
      title = `${rollText} +${statText}`
      defaultButton = opts.stat
      buttons[opts.stat] = {
        icon: '<i class="fas fa-dice-d6"></i>',
        label: statText,
        callback: callbackForStat(opts.stat),
      }
    }

    return new RollDialog({
      title,
      content,
      buttons,
      default: defaultButton,
    }).render(true)
  }

  protected static doRoll(opts: RollDialogOptions) {
    let actionExpr = 'd6'
    if (opts.stat) actionExpr += ` + @${opts.stat}`
    if (opts.bonus) actionExpr += ` + ${opts.bonus}`
    const data = {
      ...opts.actor?.getRollData(),
      track: opts.asset?.data.data.track.current,
    }

    const r = new Roll(`{${actionExpr}, d10, d10}`, data)
    createIronswornChatRoll({ roll: r, ...opts })
  }
}

// Autofucus on input box when rolling
Hooks.on('renderRollDialog', async (_dialog, html, _data) => {
  html.find('input').focus()
})

interface InlineRollListenerOptions {
  actor?: IronswornActor
  item?: IronswornItem
  name?: string
}

export function attachInlineRollListeners(html: JQuery, opts?: InlineRollListenerOptions) {
  const realOpts = { ...opts }
  html.find('a.inline-roll').on('click', (ev) => {
    ev.preventDefault()
    const el = ev.currentTarget
    const stat = el.dataset.param
    RollDialog.show({
      actor: realOpts.actor,
      stat,
    })
  })
}
