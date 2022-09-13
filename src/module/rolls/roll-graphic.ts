import {
  ACTION_DIE_SIDES,
  CHALLENGE_DIE_SIDES,
  IronswornRoll,
  PreRollOptions,
  RollOutcome,
  SourcedValue,
} from './roll'

export type RenderData = {
  prerollOptions: PreRollOptions
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
  showOutcome: boolean

  challengeDice: Partial<SourcedValue & { minmax?: 'min' | 'max' }>[]

  outcome?: SourcedValue<RollOutcome>
}

export async function renderRollGraphic(
  prerollOptions: PreRollOptions,
  roll?: IronswornRoll
) {
  console.log('renderRollGraphic prerollOptions', prerollOptions)
  console.log('renderRollGraphic roll', roll)
  const referenceRoll = roll ?? new IronswornRoll(prerollOptions)
  const renderData: RenderData = {
    prerollOptions,
    roll,
    adds: [],
    challengeDice: [{}, {}],
    isProgress: prerollOptions.progress !== undefined,
    isMatch: referenceRoll.isMatch,
    showOutcome: prerollOptions.showOutcome ?? true,
  }

  if (referenceRoll.actionDie) {
    renderData.computedActionDie = {
      ...referenceRoll.actionDie,
      value: referenceRoll.actionDie?.value,
    }
    if (referenceRoll.actionDie.value === ACTION_DIE_SIDES)
      renderData.actionMinMax = 'max'
    if (referenceRoll.actionDie.value === 1) renderData.actionMinMax = 'min'
    if (referenceRoll.canceledByNegativeMomentum) {
      renderData.actionDieCanceledByNegativeMomentum = true
      renderData.computedActionDie.source = game.i18n.localize(
        'IRONSWORN.MOMENTUM.ACTION_DIE_CANCEL.Decription'
      )
    }
  }

  renderData.adds = referenceRoll.adds
  renderData.score = referenceRoll.score
  renderData.actionScoreCapped = referenceRoll.actionScoreCapped

  renderData.challengeDice = referenceRoll.challengeDice
  if (referenceRoll.finalChallengeDice) {
    renderData.challengeDice = [
      {
        source: referenceRoll.challengeDice[0]?.source,
        value: referenceRoll.finalChallengeDice[0],
      },
      {
        source: referenceRoll.challengeDice[1]?.source,
        value: referenceRoll.finalChallengeDice[1],
      },
    ]
  }
  for (const c of renderData.challengeDice ?? []) {
    if (c.value === 1) c.minmax = 'min'
    if (c.value === CHALLENGE_DIE_SIDES) c.minmax = 'max'
  }

  if (referenceRoll.rawOutcome) {
    renderData.outcome = {
      ...referenceRoll.rawOutcome,
      value: referenceRoll.rawOutcome.value,
    }
  }
  if (prerollOptions.showOutcome) {
    console.log('this template is supposed to show the outcome')
    renderData.showOutcome = true
  }
  const graphicTemplate =
    'systems/foundry-ironsworn/templates/rolls/roll-graphic.hbs'
  console.log('data to be passed to renderTemplate', renderData)
  return renderTemplate(graphicTemplate, renderData)
}
