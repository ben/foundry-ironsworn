import {
  ACTION_DIE_SIDES,
  CHALLENGE_DIE_SIDES,
  IronswornRoll,
  PreRollOptions,
  RollOutcome,
  SourcedValue,
} from './ironsworn-roll'

interface RenderData {
  preRollOptions: PreRollOptions
  roll?: IronswornRoll

  adds: SourcedValue<number | string>[]
  computedActionDie?: SourcedValue<number>
  actionIsDie?: boolean
  actionMinMax?: 'min' | 'max' | undefined
  score?: number
  actionScoreCapped?: boolean
  actionDieCanceledByNegativeMomentum?: boolean
  isMatch: boolean
  isProgress: boolean
  hideOutcome?: boolean

  challengeDice: Partial<SourcedValue & { minmax?: 'min' | 'max' }>[]

  outcome?: SourcedValue<RollOutcome>
}

interface RollGraphicRenderOpts {
  roll?: IronswornRoll

  // Fallback for rendering if roll is not present
  preRollOptions?: PreRollOptions

  // prevent showing outcome
  hideOutcome?: boolean
}

export async function renderRollGraphic(opts: RollGraphicRenderOpts) {
  if (!opts.roll && !opts.preRollOptions) {
    throw new Error('Need roll or preRollOptions here')
  }
  opts.roll ||= new IronswornRoll(opts.preRollOptions)
  const renderData: RenderData = {
    preRollOptions: {},
    ...opts,
    adds: [],
    challengeDice: [{}, {}],
    isProgress: opts.roll.preRollOptions.progress !== undefined,
    isMatch: opts.roll.isMatch,
  }

  if (opts.roll.actionDie) {
    renderData.computedActionDie = {
      ...opts.roll.actionDie,
      value: opts.roll.actionDie?.value,
    }
    if (opts.roll.actionDie.value === ACTION_DIE_SIDES)
      renderData.actionMinMax = 'max'
    if (opts.roll.actionDie.value === 1) renderData.actionMinMax = 'min'
    if (opts.roll.canceledByNegativeMomentum) {
      renderData.actionDieCanceledByNegativeMomentum = true
      renderData.computedActionDie.source = game.i18n.localize(
        'IRONSWORN.NegativeMomentumCancel'
      )
    }
  }

  renderData.adds = opts.roll.adds
  renderData.score = opts.roll.score
  renderData.actionScoreCapped = opts.roll.actionScoreCapped

  renderData.challengeDice = opts.roll.challengeDice
  if (opts.roll.finalChallengeDice) {
    renderData.challengeDice = opts.roll.finalChallengeDice
  }
  for (const c of renderData.challengeDice ?? []) {
    if (c.value === 1) c.minmax = 'min'
    if (c.value === CHALLENGE_DIE_SIDES) c.minmax = 'max'
  }

  if (opts.roll.rawOutcome) {
    renderData.outcome = {
      ...opts.roll.rawOutcome,
      value: opts.roll.rawOutcome.value,
    }
  }
  const graphicTemplate =
    'systems/foundry-ironsworn/templates/rolls/roll-graphic.hbs'
  return renderTemplate(graphicTemplate, renderData)
}
