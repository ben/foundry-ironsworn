import {
  ACTION_DIE_SIDES,
  CHALLENGE_DIE_SIDES,
  IronswornRoll,
  PreRollOptions,
  ROLL_OUTCOME,
  SourcedValue,
} from './roll'

type RenderData = {
  prerollOptions: PreRollOptions
  roll?: IronswornRoll

  adds: SourcedValue<number | string>[]
  computedActionDie?: SourcedValue<number | string>
  actionIsDie?: boolean
  actionMinMax?: 'min' | 'max' | undefined
  actionScore?: number
  actionScoreCapped?: boolean
  actionDieCanceledByNegativeMomentum?: boolean
  isMatch: boolean

  challengeDice: Partial<
    SourcedValue & { minmax?: 'min' | 'max' | undefined }
  >[]

  outcome?: SourcedValue<ROLL_OUTCOME>
}

export async function renderRollGraphic(
  prerollOptions: PreRollOptions,
  roll?: IronswornRoll
) {
  const referenceRoll = roll ?? new IronswornRoll(prerollOptions)
  const renderData: RenderData = {
    prerollOptions,
    roll,
    adds: [],
    challengeDice: [{}, {}],
    isMatch: referenceRoll.isMatch,
  }

  if (referenceRoll.actionDie) {
    renderData.computedActionDie = {
      ...referenceRoll.actionDie,
      value: referenceRoll.actionDie?.value?.toString(),
    }
    if (referenceRoll.actionDie.value === ACTION_DIE_SIDES)
      renderData.actionMinMax = 'max'
    if (referenceRoll.actionDie.value === 1) renderData.actionMinMax = 'min'
    if (referenceRoll.canceledByNegativeMomentum) {
      renderData.actionDieCanceledByNegativeMomentum = true
      renderData.computedActionDie.source = game.i18n.localize(
        'IRONSWORN.NegativeMomentumCancel'
      )
    }
  }

  renderData.adds = referenceRoll.adds
  renderData.actionScore = referenceRoll.actionScore
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

  const graphicTemplate =
    'systems/foundry-ironsworn/templates/rolls/roll-graphic.hbs'
  return renderTemplate(graphicTemplate, renderData)
}
