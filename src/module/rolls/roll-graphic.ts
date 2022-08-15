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

  challengeDice: Partial<SourcedValue>[]

  outcome?: SourcedValue<ROLL_OUTCOME>
}

function calculateHitType(
  action?: number,
  challenge1?: number,
  challenge2?: number
): ROLL_OUTCOME | undefined {
  if (
    action === undefined ||
    challenge1 === undefined ||
    challenge2 === undefined
  ) {
    return undefined
  }

  if (action <= Math.min(challenge1, challenge2)) return ROLL_OUTCOME.MISS
  if (action > Math.max(challenge1, challenge2)) return ROLL_OUTCOME.STRONG
  return ROLL_OUTCOME.WEAK
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

  // Compute action value
  if (prerollOptions.presetActionDie) {
    renderData.computedActionDie = prerollOptions.presetActionDie
    renderData.computedActionDie.value =
      renderData.computedActionDie.value.toString()
  } else if (prerollOptions.progress) {
    renderData.computedActionDie = prerollOptions.progress
  } else if (roll?.rawActionValue) {
    renderData.computedActionDie = {
      source: 'd6',
      value: roll.rawActionValue, // TODO: post-roll override
    }
    if (roll.rawActionValue === 6) renderData.actionMinMax = 'max'
    if (roll.rawActionValue === 1) renderData.actionMinMax = 'min'
  }

  // Compute all the adds
  if (prerollOptions.action) {
    renderData.adds.push(prerollOptions.action)
  } else if (prerollOptions.moveDfId || prerollOptions.moveId) {
    // Move rolls will always add a stat
    renderData.adds.push({
      source: 'Select a stat',
      value: `(${game.i18n.localize('IRONSWORN.Stat')})`,
    })
  }
  if (prerollOptions.adds) {
    renderData.adds.push({
      source: game.i18n.localize('IRONSWORN.Adds'),
      value: prerollOptions.adds,
    })
  }
  // TODO: post-roll adds

  // Compute challenge dice
  if (roll?.rawChallengeValues !== undefined) {
    renderData.challengeDice = roll.rawChallengeValues.map((x) => ({
      source: 'd10',
      value: x,
    }))
  } else if (prerollOptions.extraChallengeDice) {
    for (let i = 0; i < prerollOptions.extraChallengeDice.value; i++) {
      renderData.challengeDice.push({
        source: 'Extra challenge dice',
      })
    }
  }
  // TODO: post-roll selection/overrides for challenge dice

  // Compute outcome
  if (prerollOptions.automaticOutcome) {
    renderData.outcome = prerollOptions.automaticOutcome
  } else {
    const action = prerollOptions.presetActionDie?.value ?? roll?.rawActionValue
    const challenge1 =
      roll?.postRollOptions.replacedChallenge1?.value ??
      roll?.rawChallengeValues?.[0]
    const challenge2 =
      roll?.postRollOptions.replacedChallenge1?.value ??
      roll?.rawChallengeValues?.[1]
    const outcome = calculateHitType(action, challenge1, challenge2)
    if (outcome) {
      renderData.outcome = {
        value: outcome,
        source: game.i18n.localize('IRONSWORN.Roll'),
      }
    }
  }

  const graphicTemplate =
    'systems/foundry-ironsworn/templates/rolls/roll-graphic.hbs'
  return renderTemplate(graphicTemplate, renderData)
}
