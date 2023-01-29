import { fill, range } from 'lodash'
import {
  NumericRank,
  NumericRankI18nKeys,
  NumericRankIncrements,
  RANKS,
  RANK_INCREMENTS,
} from '../../constants'
import { IronswornPrerollDialog } from '../../rolls'

export class JournalProgressPageSheet extends JournalPageSheet {
  static get defaultOptions() {
    const options = super.defaultOptions
    options.height = 300
    options.classes.push('progress', 'ironsworn')
    console.log({ options })
    return options
  }

  get template() {
    return `systems/foundry-ironsworn/templates/journal/progress-page-${
      this.isEditable ? 'edit' : 'view'
    }.hbs`
  }

  protected async _renderInner(data) {
    await (loadTemplates as any)({
      progressButtons:
        'systems/foundry-ironsworn/templates/journal/progress-buttons.hbs',
      progressBoxes:
        'systems/foundry-ironsworn/templates/journal/progress-boxes.hbs',
      rankPips:
        'systems/foundry-ironsworn/templates/journal/progress-rank-pips.hbs',
    })
    return super._renderInner(data)
  }

  getData(options?: Partial<DocumentSheetOptions> | undefined): any {
    const data = super.getData(options) as any

    data.currentRank = game.i18n.localize(
      NumericRankI18nKeys[data.data.system.rank ?? NumericRank.troublesome]
    )
    data.rankButtons = range(1, 6).map((numericRank) => ({
      rank: numericRank,
      i18nRank: game.i18n.localize(NumericRankI18nKeys[numericRank]),
      selected: data.data.system.rank === numericRank,
    }))

    // Compute some progress numbers
    const boxes = range(10).map((_) => ({
      ticks: 0,
      lineTransforms: [] as string[],
    }))
    const ticksRemainder = data.data.system.ticks % 4
    data.filledBoxes = Math.floor(data.data.system.ticks / 4)

    fill(boxes, { ticks: 4, lineTransforms: [] }, 0, data.filledBoxes)
    boxes[data.filledBoxes] = { ticks: ticksRemainder, lineTransforms: [] }

    // List of line transforms
    const transforms = [
      'rotate(-45, 50, 50)',
      'rotate(45, 50, 50)',
      'rotate(-90, 50, 50)',
      '',
    ]
    for (let i = 0; i < boxes.length; i++) {
      const box = boxes[i]

      if (box.ticks > 0) box.lineTransforms.push(transforms[0])
      if (box.ticks > 1) box.lineTransforms.push(transforms[1])
      if (box.ticks > 2) box.lineTransforms.push(transforms[2])
      if (box.ticks > 3) box.lineTransforms.push(transforms[3])
    }
    data.boxes = boxes

    return data
  }

  activateListeners(html: JQuery<HTMLElement>): void {
    html.find('.rank-pip').on('click', async (ev) => {
      await this.object.update({
        // @ts-ignore
        system: { rank: parseInt(ev.currentTarget.dataset.rank ?? '0') },
      })
      this.render()
    })
    html.find('[data-on-click="markProgress"]').on('click', async () => {
      await increment(this.object, 1)
      this.render()
    })
    html.find('[data-on-click="eraseProgress"]').on('click', async () => {
      await increment(this.object, -1)
      this.render()
    })
    html.find('[data-on-click="rollProgress"]').on('click', async () => {
      const { filledBoxes } = await this.getData()
      IronswornPrerollDialog.showForProgress(
        this.object.name ?? '(progress)',
        filledBoxes
      )
    })
  }
}

function increment(object: any, direction: 1 | -1) {
  const rank = object.system.rank ?? NumericRank.troublesome
  const increment = NumericRankIncrements[rank]
  const currentValue = object.system.ticks || 0
  const newValue = currentValue + increment * direction
  return object.update({
    system: { ticks: Math.min(Math.max(newValue, 0), 40) },
  })
}
