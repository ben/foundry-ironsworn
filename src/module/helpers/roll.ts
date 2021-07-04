import { IronswornActor } from '../actor/actor'
import { IronswornItem } from '../item/item'
import { AssetItemData } from '../item/itemtypes'
import { EnhancedDataswornMove } from './data'
import { capitalize } from './util'

interface MoveRollDialogOptions {
  move: EnhancedDataswornMove
  actor?: IronswornActor
  asset?: Item<AssetItemData>
}
export class IronswornMoveRollDialog extends Dialog {
  static async show(opts: MoveRollDialogOptions) {
    const template = 'systems/foundry-ironsworn/templates/move-roll-dialog.hbs'
    const html = await renderTemplate(template, opts)
    const callbackForStat = (stat: string) => (x) => {
      const form = x[0].querySelector('form')
      const bonus = form.bonus.value ? parseInt(form.bonus.value, 10) : undefined
      rollAssetOrMove({
        ...opts,
        stat,
        bonus,
      })
    }
    const buttons = {}
    for (const stat of opts.move.Stats) {
      buttons[stat] = {
        icon: '<i class="fas fa-dice-d6"></i>',
        label: game.i18n.localize(`IRONSWORN.${capitalize(stat)}`),
        callback: callbackForStat(stat)
      }
    }
    new IronswornMoveRollDialog({
      title: opts.move.Name,
      content: html,
      buttons,
      default: opts.move.Stats[0],
    }).render(true)
  }
}

interface AssetMoveRollOptions {
  move: EnhancedDataswornMove
  actor?: IronswornActor
  asset?: Item<AssetItemData>
  stat?: string
  bonus?: number
}
export async function rollAssetOrMove(opts: AssetMoveRollOptions) {
  let actionExpr = 'd6'
  if (opts.stat) actionExpr += ` + @${opts.stat}`
  if (opts.bonus) actionExpr += ` + ${opts.bonus}`
  const data = {
    ...opts.actor?.getRollData(),
    track: opts.asset?.data.data.track.current,
  }

  const r = new Roll(`{${actionExpr}, d10, d10}`, data).roll()
  let moveTitle = opts.move.Name
  if (opts.stat) moveTitle += ` (${opts.stat})`
  r.toMessage({ flavor: `<div class="move-title">${moveTitle}</div>` })
}

export async function ironswornMoveRoll(bonusExpr = '0', values = {}, title: string) {
  const r = new Roll(`{d6+${bonusExpr}, d10,d10}`, values).roll()
  r.toMessage({ flavor: `<div class="move-title">${title}</div>` })
}

export class IronswornRollDialog extends Dialog {
  static async showDialog(data: any, stat: string, title: string) {
    const template = 'systems/foundry-ironsworn/templates/roll-dialog.hbs'
    const templateData = { data, stat }
    const html = await renderTemplate(template, templateData)
    const d = new IronswornRollDialog({
      title: title || `Roll +${stat}`,
      content: html,
      buttons: {
        roll: {
          icon: '<i class="fas fa-dice-d10"></i>',
          label: game.i18n.localize('IRONSWORN.Roll'),
          callback: (x) => {
            const form = x[0].querySelector('form')
            const bonus = parseInt(form[0].value, 10)
            ironswornMoveRoll(`@${stat}+${bonus || 0}`, data, title)
          },
        },
      },
      default: 'roll',
    })
    d.render(true)
  }
}

// Autofucus on input box when rolling
Hooks.on('renderIronswornRollDialog', async (_dialog, html, _data) => {
  html.find('input').focus()
})
Hooks.on('renderIronswornMoveRollDialog', async (_dialog, html, _data) => {
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
    const moveTitle = `${realOpts.item?.name || realOpts.name} (${el.dataset.param})`
    IronswornRollDialog.showDialog(realOpts.actor?.data.data, el.dataset.param || '', moveTitle)
  })
}
