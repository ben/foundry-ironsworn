import { sortBy } from 'lodash'
import { IronswornActor } from '../actor/actor'
import {
  createIronswornChatRoll,
  createIronswornFeatureChat,
  createIronswornMoveChat,
} from '../chat/chatrollhelpers'
import { IronswornItem } from '../item/item'
import { DelveDomainDataSource, DelveThemeDataSource } from '../item/itemtypes'
import { formatRollPlusStat } from '../rolls/ironsworn-roll-message.js'
import { EnhancedDataswornMove } from './data'
import { IronswornSettings } from './settings'
import { capitalize } from './util'

interface RollDialogOptions {
  actor?: IronswornActor
  site?: IronswornActor
  asset?: IronswornItem
  move?: EnhancedDataswornMove
  stat?: string
  bonus?: number
}

export class RollDialog extends Dialog {
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ['ironsworn', 'dialog', `theme-${IronswornSettings.theme}`],
      width: 500,
    })
  }

  static async show(opts: RollDialogOptions) {
    // Check inputs
    if (!opts.move && !opts.stat && !(opts.move && opts.stat)) {
      throw new Error('Must provide only one of `move` or `stat`')
    }
    if (opts.stat && opts.bonus !== undefined) {
      // Got everything we need, just roll it
      return this.rollAndCreateChatMessage(opts)
    }
    if (opts.move && (!opts.move.Stats || opts.move.Stats.length === 0)) {
      // Just send the move text to chat
      return createIronswornMoveChat(opts)
    }

    // Render content
    const template = 'systems/foundry-ironsworn/templates/roll-dialog.hbs'
    const renderOpts = { ...opts } as any
    if (!opts.actor) {
      const allCharacters = sortBy(
        game.actors?.filter((x) => x.type === 'character'),
        'name'
      )
      if (allCharacters.length === 1) {
        renderOpts.actor = allCharacters[0]
        opts.actor = allCharacters[0]
      } else {
        renderOpts.allCharacters = allCharacters
        renderOpts.mruCharacter = opts.site?.getFlag(
          'foundry-ironsworn',
          'mru-character'
        )
      }
    }
    const content = await renderTemplate(template, renderOpts)

    const callbackForStat = (stat: string) => (dialogData: JQuery) => {
      const form = dialogData[0].querySelector('form') as HTMLFormElement
      const bonus = form.bonus.valueAsNumber
      let actor = opts.actor
      if (form.char?.value) {
        actor = game.actors?.get(form.char.value)
        opts.site?.setFlag('foundry-ironsworn', 'mru-character', actor?.id)
      }
      this.rollAndCreateChatMessage({
        ...opts,
        actor,
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
          icon: '<i class="isicon-d10-tilt"></i>',
          label:
            '<span class=button-text>' +
            game.i18n.localize(`IRONSWORN.${capitalize(stat)}`) +
            '</span>',
          callback: callbackForStat(stat),
        }
      }
    } else if (opts.stat) {
      const statText = game.i18n.localize(`IRONSWORN.${capitalize(opts.stat)}`)
      title = formatRollPlusStat(opts.stat)
      defaultButton = opts.stat
      buttons[opts.stat] = {
        icon: '<i class="isicon-d10-tilt"></i>',
        label: `<span class=button-text>${statText}</span>`,
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

  protected static rollAndCreateChatMessage(opts: RollDialogOptions) {
    let actionExpr = 'd6'
    if (opts.stat) actionExpr += ` + @${opts.stat}`
    if (opts.bonus) actionExpr += ` + ${opts.bonus}`
    const data = {
      ...opts.actor?.getRollData(),
      track:
        opts.asset?.data.type === 'asset'
          ? opts.asset.data.data.track.current
          : undefined,
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
  name?: string
}

export function attachInlineRollListeners(
  html: JQuery,
  opts?: InlineRollListenerOptions
) {
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

interface SiteFeatureRollInput {
  theme?: IronswornItem
  domain?: IronswornItem
}

export async function rollSiteFeature(params: SiteFeatureRollInput) {
  if (!params.theme || !params.domain) return
  if (
    params.domain.type !== 'delve-domain' ||
    params.theme.type !== 'delve-theme'
  )
    return

  const domainData = params.domain.data as DelveDomainDataSource
  const themeData = params.theme.data as DelveThemeDataSource

  const roll = new Roll('1d100')
  await roll.evaluate({ async: true })
  if (roll.total === undefined) return

  // Find the theme/domain and the matching feature
  const pred = (x) =>
    x.low <= (roll.total || 0) && x.high >= (roll.total || 100)
  const feature =
    domainData.data.features.find(pred) || themeData.data.features.find(pred)
  if (feature) {
    return createIronswornFeatureChat({ ...params, roll, feature })
  }
}

export function maybeShowDice(roll: Roll) {
  const dice3d = (game as any).dice3d
  if (!dice3d) return
  dice3d.showForRoll(roll, game.user, true)
}
