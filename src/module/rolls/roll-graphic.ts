import {
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
  actionMinMax?: string
  actionTotal?: number
  actionTotalCapped?: boolean
  actionCanceledByNegativeMomentum?: boolean

  challengeDice: Partial<SourcedValue & { minmax?: string }>[]

  outcome?: SourcedValue<string>
}

export async function renderRollGraphic(
  prerollOptions: PreRollOptions,
  roll?: IronswornRoll
) {
  const renderData: RenderData = {
    prerollOptions,
    roll,
    adds: [],
    challengeDice: [{}, {}],
  }
  const referenceRoll = roll ?? new IronswornRoll(prerollOptions)

  if (referenceRoll.actionDie) {
    renderData.computedActionDie = {
      ...referenceRoll.actionDie,
      value: referenceRoll.actionDie?.value?.toString(),
    }
    if (referenceRoll.actionDie.value === 6) renderData.actionMinMax = 'max'
    if (referenceRoll.actionDie.value === 1) renderData.actionMinMax = 'min'
    if (referenceRoll.canceledByNegativeMomentum) {
      renderData.actionCanceledByNegativeMomentum = true
      renderData.computedActionDie.source = game.i18n.localize(
        'IRONSWORN.NegativeMomentumCancel'
      )
    }
  }

  renderData.adds = referenceRoll.adds
  renderData.actionTotal = referenceRoll.actionTotal
  renderData.actionTotalCapped = referenceRoll.actionTotalCapped

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
    if (c.value === 10) c.minmax = 'max'
  }

  const outcomeKeys = {
    [ROLL_OUTCOME.MISS]: 'IRONSWORN.Miss',
    [ROLL_OUTCOME.WEAK]: 'IRONSWORN.WeakHit',
    [ROLL_OUTCOME.STRONG]: 'IRONSWORN.StrongHit',
  }

  if (referenceRoll.preAdjustmentOutcome) {
    renderData.outcome = {
      ...referenceRoll.preAdjustmentOutcome,
      value: game.i18n.localize(
        outcomeKeys[referenceRoll.preAdjustmentOutcome.value]
      ),
    }
  }

  const graphicTemplate =
    'systems/foundry-ironsworn/templates/rolls/roll-graphic.hbs'
  return renderTemplate(graphicTemplate, renderData)
}
