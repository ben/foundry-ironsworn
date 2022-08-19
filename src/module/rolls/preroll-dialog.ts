import { IMoveTrigger } from 'dataforged'
import type { RollMethod } from 'dataforged'
import { capitalize, cloneDeep, maxBy, minBy, sortBy } from 'lodash'
import { IronswornActor } from '../actor/actor'
import { getFoundryMoveByDfId } from '../dataforged'
import { IronswornSettings } from '../helpers/settings'
import { IronswornItem } from '../item/item'
import { SFMoveDataProperties } from '../item/itemtypes'
import {
  IronswornRoll,
  PreRollOptions,
  ROLL_OUTCOME,
  SourcedValue,
} from './roll'
import { renderRollGraphic } from './roll-graphic'
import { CharacterDataProperties } from '../actor/actortypes'
import { IronswornRollChatMessage } from '.'

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
  let stat = normalizedStats[0]

  if (mode === 'Highest' || mode === 'Lowest') {
    const statMap = {}
    for (const x of normalizedStats) {
      statMap[x] = actor.data.data[x]
    }
    const fn = mode === 'Highest' ? maxBy : minBy
    stat = fn(Object.keys(statMap), (x) => statMap[x]) ?? stats[0]
  } else if (mode !== 'Any') {
    // TODO: 'all of'
    throw new Error(`Cannot handle rolling with '${mode}' mode`)
  }

  const source = game.i18n.localize(`IRONSWORN.${capitalize(stat)}`)
  return { source, value: actor.data.data[stat] }
}

function prerollOptionsWithFormData(
  form: JQuery<HTMLFormElement>,
  base: PreRollOptions
): PreRollOptions {
  const opts = cloneDeep(base)

  const valMap: Record<string, string> = form
    .serializeArray()
    .reduce((coll, { name, value }) => ({ ...coll, [name]: value }), {})

  opts.adds = parseInt(valMap.adds || '0')

  if (valMap.automaticOutcome) {
    opts.automaticOutcome = {
      source: 'set manually',
      value: valMap.automaticOutcomeValue as ROLL_OUTCOME,
    }
  }
  if (valMap.presetActionDie) {
    opts.presetActionDie = {
      source: 'set manually',
      value: parseInt(valMap.presetActionDieValue || '0', 10),
    }
  }
  if (valMap.extraChallengeDice) {
    opts.extraChallengeDice = {
      source: 'set manually',
      value: parseInt(valMap.extraChallengeDiceValue || '0', 10),
    }
  }

  return opts
}

export class IronswornPrerollDialog extends Dialog {
  prerollOptions: PreRollOptions = {}

  constructor(
    pro: PreRollOptions,
    data: Dialog.Data,
    options?: Partial<Options>
  ) {
    super(data, options)
    this.prerollOptions = pro
  }

  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ['ironsworn', 'dialog', `theme-${IronswornSettings.theme}`],
      width: 500,
    })
  }

  static async showForStat(
    name: string,
    value: number,
    actor?: IronswornActor
  ) {
    const rollText = game.i18n.localize('IRONSWORN.Roll')
    const statText = game.i18n.localize(`IRONSWORN.${capitalize(name)}`)
    const title = `${rollText} +${statText}`

    const prerollOptions: PreRollOptions = {
      stat: {
        source: name,
        value,
      },

      actorId: actor?.id || undefined,
    }

    const content = await this.renderContent({
      prerollOptions,
      action: true,
    })
    const buttons = {
      [name]: {
        label: statText,
        icon: '<i class="isicon-d10-tilt juicy"></i>',
        callback: (el: HTMLElement | JQuery<HTMLElement>) => {
          IronswornPrerollDialog.submitRoll(el, prerollOptions)
        },
      },
    }
    return new IronswornPrerollDialog(prerollOptions, {
      title,
      content,
      buttons,
      default: name,
    }).render(true)
  }

  static async showForProgress(
    name: string,
    value: number,
    actor?: IronswornActor
  ) {
    const rollText = game.i18n.localize('IRONSWORN.ProgressRoll')
    const title = `${rollText}: ${name}`

    const prerollOptions: PreRollOptions = {
      progress: {
        source: name,
        value,
      },

      actorId: actor?.id || undefined,
    }

    const content = await this.renderContent({ prerollOptions })
    const buttons = {
      [name]: {
        label: game.i18n.localize('IRONSWORN.Roll'),
        icon: '<i class="isicon-d10-tilt juicy"></i>',
        callback: (el: HTMLElement | JQuery<HTMLElement>) => {
          IronswornPrerollDialog.submitRoll(el, prerollOptions)
        },
      },
    }
    return new IronswornPrerollDialog(prerollOptions, {
      title,
      content,
      buttons,
      default: name,
    }).render(true)
  }

  static async showForOfficialMove(moveDfId: string, actor?: IronswornActor) {
    const moveItem = await getFoundryMoveByDfId(moveDfId)
    if (!moveItem) {
      throw new Error(`Couldn't find item for move '${moveDfId}'`)
    }

    return this.showForMoveItem(moveItem, { moveDfId }, actor)
  }

  static async showForMove(move: IronswornItem, actor?: IronswornActor) {
    if (move.type !== 'sfmove') {
      throw new Error('this only works with SF moves')
    }

    return this.showForMoveItem(move, { moveId: move.id || undefined }, actor)
  }

  private static async showForMoveItem(
    move: IronswornItem,
    prerollOptions: PreRollOptions,
    actor?: IronswornActor
  ) {
    prerollOptions.actorId = actor?.id || undefined

    const data = move.data as SFMoveDataProperties
    const options = rollableOptions(data.data.Trigger)
    if (!options.length) {
      throw new Error(
        `Move '${move.name}' (${JSON.stringify(
          prerollOptions
        )}) is not rollable`
      )
    }

    const title = move.name || 'MOVE'
    const allActors = [] as IronswornActor[]
    if (actor) {
      allActors.push(actor)
    } else {
      allActors.push(
        ...sortBy(
          game.actors?.filter((x) => x.type === 'character'),
          'name'
        )
      )
    }
    const showActorSelect = allActors.length > 1

    const content = await this.renderContent({
      prerollOptions,
      move,
      actor,
      allActors,
      showActorSelect,
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
        callback: (el: JQuery<HTMLElement>) => {
          let rollingActor: IronswornActor
          if (allActors.length === 1) {
            rollingActor = allActors[0]
          } else {
            // Get the selected actor from the dialog
            const actorId = el.find('#char').val() as string
            rollingActor = game.actors?.get(actorId)!
          }

          // Set up for the roll
          const actorData = rollingActor.data as CharacterDataProperties
          prerollOptions.momentum = actorData.data.momentum
          prerollOptions.stat = resolvedStatForMode(mode, stats, rollingActor)

          IronswornPrerollDialog.submitRoll(el, prerollOptions)
        },
      }
    }

    for (let i = 0; i < options.length; i++) {
      const option = options[i]
      addButton(i, option.Method, option.Using)
    }

    return new IronswornPrerollDialog(prerollOptions, {
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
    const realOpts = prerollOptionsWithFormData($(el).find('form'), opts)

    const r = new IronswornRoll(realOpts)
    return new IronswornRollChatMessage(r).createOrUpdate()
  }

  private static async renderContent(data: any): Promise<string> {
    const graphic = await renderRollGraphic(data.prerollOptions)
    const template =
      'systems/foundry-ironsworn/templates/rolls/preroll-dialog.hbs'
    return renderTemplate(template, { ...data, graphic })
  }

  activateListeners(html: JQuery<HTMLElement>): void {
    super.activateListeners(html)

    // Resize when expanding the "advanced" section
    html.find('details').on('toggle', (ev) => {
      const delta = (ev.currentTarget.open ? 1 : -1) * 90
      const app = html.parents('.app')
      app.height((app.height() ?? 0) + delta)
    })

    // Re-render the graphic when controls change
    const rerender = async () => {
      const pro = prerollOptionsWithFormData(
        this.element.find('form'),
        this.prerollOptions
      )
      const graphic = await renderRollGraphic(pro)
      this.element.find('.ironsworn-roll').replaceWith(graphic)
    }
    html.find('input').on('change', rerender)
    html.find('select').on('change', rerender)
  }
}
