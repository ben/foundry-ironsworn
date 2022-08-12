import { IMoveTrigger } from 'dataforged'
import type { RollMethod } from 'dataforged'
import { capitalize, maxBy, minBy } from 'lodash'
import { IronswornActor } from '../actor/actor'
import { getFoundryMoveByDfId } from '../dataforged'
import { IronswornSettings } from '../helpers/settings'
import { IronswornItem } from '../item/item'
import { SFMoveDataProperties } from '../item/itemtypes'
import { IronswornRoll, PreRollOptions, SourcedValue } from './roll'

interface IronswornRollDalogOptions {}

function rollableOptions(trigger: IMoveTrigger) {
  if (!trigger.Options) return []

  const actionOptions = trigger.Options.filter(
    (x) => x['Roll type'] === 'Action roll'
  )
  if (!actionOptions.length) return []

  const allowedUsings = [
    'edge',
    'iron',
    'heart',
    'shadow',
    'wits',
    'health',
    'spirit',
    'supply',
  ]
  return actionOptions.filter((x) =>
    (x.Using as string[]).every((u) => allowedUsings.includes(u.toLowerCase()))
  )
}

function resolvedStatForMode(
  mode: RollMethod,
  stats: string[],
  actor: IronswornActor
): SourcedValue {
  const normalizedStats = stats.map((x) => x.toLowerCase())
  let source = normalizedStats[0]

  if (mode === 'Highest' || mode === 'Lowest') {
    const statMap = {}
    for (const x of normalizedStats) {
      statMap[x] = actor.data.data[x]
    }
    const fn = mode === 'Highest' ? maxBy : minBy
    source = fn(Object.keys(statMap), (x) => statMap[x]) ?? stats[0]
  } else if (mode !== 'Any') {
    // TODO: 'all of'
    throw new Error(`Cannot handle rolling with '${mode}' mode`)
  }

  return { source, value: actor.data.data[source] }
}

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

  static async showForOfficialMove(moveDfId: string, actor: IronswornActor) {
    const moveItem = await getFoundryMoveByDfId(moveDfId)
    if (!moveItem) {
      throw new Error(`Couldn't find item for move '${moveDfId}'`)
    }

    return this.showForMoveItem(moveItem, actor, { moveDfId })
  }

  static async showForCustomMove(move: IronswornItem, actor: IronswornActor) {
    if (move.type !== 'sfmove') {
      throw new Error('this only works with SF moves')
    }

    return this.showForMoveItem(move, actor, { moveId: move.id || undefined })
  }

  private static async showForMoveItem(
    move: IronswornItem,
    actor: IronswornActor,
    prerollOpts: PreRollOptions
  ) {
    const data = move.data as SFMoveDataProperties
    const options = rollableOptions(data.data.Trigger)
    if (!options.length) {
      throw new Error(
        `Move '${move.name}' (${JSON.stringify(prerollOpts)}) is not rollable`
      )
    }

    const title = move.name || 'MOVE'

    const content = await this.renderContent({
      prerollOpts,
      move,
      actor,
      action: true,
    })
    const buttons = {}
    const addButton = (i: number, mode: RollMethod, stats: string[]) => {
      // TODO: i18n
      const label = mode === 'Any' ? stats[0] : `${mode} of ${stats.join(', ')}`

      buttons[i.toString()] = {
        // use the below instead as a silly method for sneaking classes in
        // buttons[
        //   kebabCase(label) + ' clickable isicon-d10-tilt juicy icon-button'
        // ] = {
        label,
        icon: '<i class="isicon-d10-tilt juicy"></i>',
        callback: (el: HTMLElement | JQuery<HTMLElement>) => {
          prerollOpts.action = { stat: resolvedStatForMode(mode, stats, actor) }
          console.log(prerollOpts)
          IronswornPrerollDialog.submitRoll(el, prerollOpts)
        },
      }
    }

    for (let i = 0; i < options.length; i++) {
      const option = options[i]
      addButton(i, option.Method, option.Using)
    }

    return new IronswornPrerollDialog({
      title,
      content,
      buttons,
      default: '0',
    }).render(true)
  }

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

  activateListeners(html: JQuery<HTMLElement>): void {
    super.activateListeners(html)
    html.find('details').on('toggle', (ev) => {
      const delta = (ev.currentTarget.open ? 1 : -1) * 90
      const app = html.parents('.app')
      app.height((app.height() ?? 0) + delta)
    })
  }
}
