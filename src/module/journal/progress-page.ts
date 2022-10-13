import { fill, range } from 'lodash'
import { NumericRank } from '../dataforged'

export class JournalProgressPageSheet extends JournalPageSheet {
  static get defaultOptions() {
    const options = super.defaultOptions
    options.classes.push('progress')
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

    // Foundry doesn't use the template data here, we have to supply our own
    data.data.system.ticks ??= 0
    data.data.system.rank ??= NumericRank.troublesome

    // Compute some basic information
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

    // Compute the svg marks for progress
    console.log(data)
    return data
  }

  activateListeners(html: JQuery<HTMLElement>): void {
    html.find('.ironsworn__progress__mark').on('click', () => {
      console.log('mark', this)
    })
    html.find('.ironsworn__progress__unmark').on('click', () => {
      console.log('unmark', this)
    })
    html.find('.ironsworn__progress__roll').on('click', () => {
      console.log('roll', this)
    })
  }
}
