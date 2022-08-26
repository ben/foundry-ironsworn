// this file is basically deprecated. use rolls/chat-message.ts instead
import { Evaluated } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/client/dice/roll.js'
import { compact, sortBy } from 'lodash'
import { marked } from 'marked'
import { IronswornActor } from '../actor/actor'
import { DenizenSlot } from '../actor/actortypes'
import { getDFMoveByDfId, getFoundryTableByDfId } from '../dataforged'
import {
  createStarforgedOracleTree,
  findPathToNodeByTableId,
} from '../features/customoracles'
import { DsRollOutcome, EnhancedDataswornMove } from '../helpers/data'
import { IronswornSettings } from '../helpers/settings'
import { capitalize } from '../helpers/util'
import { IronswornItem } from '../item/item'
import { FeatureOrDanger, SFMoveDataProperties } from '../item/itemtypes'
import {
  computeRollOutcome,
  computeOutcomeText,
} from '../rolls/ironsworn-roll-message.js'
import {
  ACTION_DIE_SIDES,
  CHALLENGE_DIE_SIDES,
  DfRollOutcome,
  RollOutcome,
  SCORE_MAX,
} from '../rolls/ironsworn-roll'
import { MoveContentCallbacks } from './movecontentcallbacks'

interface RollMessageParams {
  roll: Roll
  actor?: IronswornActor
  asset?: IronswornItem
  move?: EnhancedDataswornMove
  stat?: string
  bonus?: number
  isProgress?: boolean
  subtitle?: string
}
interface SFRollMessageParams {
  roll: Roll
  actor: IronswornActor
  move: IronswornItem
  mode: string
  stats: string[]
  usedStat: string
  bonus: number
}

function actionRoll(roll: any): Roll {
  return roll.terms[0].rolls.find(
    (x) => x.dice.length === 0 || x.dice[0].faces === ACTION_DIE_SIDES
  )
}

function challengeRoll(roll: any): [Roll, Roll] {
  return roll.terms[0].rolls.filter(
    (x) => x.dice.length > 0 && x.dice[0].faces === CHALLENGE_DIE_SIDES
  )
}

interface DieTotals {
  actionScore: number
  actionScoreCapped: boolean
  rawActionScore: number
  canceledActionDie: number
  challengeDie1: number
  challengeDie2: number
  match: boolean
}

function calculateDieTotals(roll: Roll): DieTotals {
  const actionDieRoll = actionRoll(roll)
  const challengeDice = challengeRoll(roll)
  const [challengeDie1, challengeDie2] = challengeDice.map(
    (x) => x.total as number
  )
  const rawActionScore = actionDieRoll.terms.find((x) => x instanceof Die)

  // Cap action at 10
  let actionScore = actionDieRoll.total as number
  let actionScoreCapped = false
  if (actionScore > SCORE_MAX) {
    actionScoreCapped = true
    actionScore = SCORE_MAX
  }

  const canceledActionDie = new Roll(
    actionDieRoll.formula.replace(/1d6\S+/, '0')
  )
  canceledActionDie.evaluate({ async: false })

  return {
    actionScore,
    actionScoreCapped,
    rawActionScore: rawActionScore?.total as number,
    canceledActionDie: canceledActionDie.total as number,
    challengeDie1,
    challengeDie2,
    match: challengeDie1 === challengeDie2,
  }
}

function calculateCardTitle(params: RollMessageParams) {
  if (params.move) {
    let title = game.i18n.localize(
      `IRONSWORN.MoveContents.${params.move.Name}.title`
    )
    if (title.startsWith('IRONSWORN.')) {
      title = params.move.Name
    }

    if (params.stat) {
      title += ` +${game.i18n.localize('IRONSWORN.' + capitalize(params.stat))}`
    } else if (params.subtitle) {
      title += `: ${params.subtitle}`
    }
    return title
  }

  // TODO: i18n for assets
  if (params.asset) {
    let title = params.asset.data.name
    if (params.stat) {
      if (params.stat === 'track' && params.asset?.data.type === 'asset') {
        title += ` +${params.asset.data.data.track.name}`
      } else {
        const statText = game.i18n.localize(
          `IRONSWORN.${capitalize(params.stat)}`
        )
        title += ` +${statText}`
      }
    }
    return title
  }

  if (params.subtitle) {
    return `${game.i18n.localize('IRONSWORN.ProgressRoll')}: ${params.subtitle}`
  }

  const rollText = game.i18n.localize('IRONSWORN.Roll')
  if (params.stat) {
    const statText = game.i18n.localize(`IRONSWORN.${capitalize(params.stat)}`)
    return `${rollText} +${statText}`
  }

  return rollText
}

function calculateSFCardTitle(params: SFRollMessageParams) {
  return `${params.move.name} (${game.i18n.localize(
    'IRONSWORN.' + capitalize(params.usedStat)
  )})`
}

function calculateMoveResultText(
  outcome: RollOutcome,
  move?: EnhancedDataswornMove
): string | undefined {
  if (!move) return undefined

  const dfOutcomeKey = DsRollOutcome[outcome]
  return move[dfOutcomeKey]
}

function calculateSFMoveResultText(
  type: RollOutcome,
  match: boolean,
  move: IronswornItem
) {
  const data = move.data as SFMoveDataProperties
  const dsOutcomeKey = DfRollOutcome[type]
  const outcome = data.data.Outcomes?.[dsOutcomeKey]

  if (match) {
    return outcome['With a Match']?.Text ?? outcome.Text
  }
  return outcome.Text
}

interface MomentumProps {
  momentumHitType?: RollOutcome
  momentumHitTypeI18n?: string
  negativeMomentumCancel?: boolean
}
function calculateMomentumProps(
  roll: Roll,
  actor?: IronswornActor
): MomentumProps {
  if (!actor || actor.data.type !== 'character') return {}
  const {
    actionScore: actionScore,
    rawActionScore: rawActionDie,
    challengeDie1,
    challengeDie2,
    match,
  } = calculateDieTotals(roll)

  const momentum = actor.data.data.momentum
  if (momentum < 0 && -momentum === rawActionDie)
    return {
      negativeMomentumCancel: true,
    }

  const rawOutcome = computeRollOutcome(
    actionScore,
    challengeDie1,
    challengeDie2
  )
  const momentumHitType = computeRollOutcome(
    momentum,
    challengeDie1,
    challengeDie2
  )
  const momentumHitTypeI18n = computeOutcomeText(momentumHitType, match)

  if (momentumHitType > rawOutcome)
    return {
      momentumHitType,
      momentumHitTypeI18n,
    }
  return {}
}

export async function sfNextOracles(move: IronswornItem): Promise<RollTable[]> {
  const { dfid } = (move.data as SFMoveDataProperties).data
  const dfMove = await getDFMoveByDfId(dfid)
  const dfIds = dfMove?.Oracles || []
  return compact(await Promise.all(dfIds.map(getFoundryTableByDfId)))
}

export async function createIronswornChatRoll(params: RollMessageParams) {
  await params.roll.evaluate({ async: true })
  const {
    actionScore: action,
    actionScoreCapped: actionCapped,
    canceledActionDie: canceledAction,
    challengeDie1,
    challengeDie2,
    match,
  } = calculateDieTotals(params.roll)

  // Momentum: if this is not a progress roll, it might be possible to upgrade
  let hitType = computeRollOutcome(action, challengeDie1, challengeDie2)
  let momentumProps: MomentumProps = {}
  if (!params.isProgress) {
    momentumProps = calculateMomentumProps(params.roll, params.actor)
    if (momentumProps.negativeMomentumCancel) {
      hitType = computeRollOutcome(canceledAction, challengeDie1, challengeDie2)
    }
  }

  const bonusContent = MoveContentCallbacks[params.move?.Name || '']?.call(
    this,
    {
      hitType,
      stat: params.stat,
    }
  )

  const renderData = {
    themeClass: `theme-${IronswornSettings.theme}`,
    action,
    actionCapped,
    hitType: computeOutcomeText(hitType, match),
    title: calculateCardTitle(params),
    resultText: calculateMoveResultText(hitType, params.move),
    bonusContent,
    ...momentumProps,
    ...params,
  }
  const content = await renderTemplate(
    'systems/foundry-ironsworn/templates/chat/roll.hbs',
    renderData
  )

  const messageData = {
    speaker: ChatMessage.getSpeaker(),
    content,
    type: CONST.CHAT_MESSAGE_TYPES.ROLL,
    roll: params.roll,
  }

  const cls = CONFIG.ChatMessage.documentClass
  return cls.create(messageData as any, {})
}

export async function createIronswornMoveChat(opts: {
  move?: EnhancedDataswornMove
  site?: IronswornActor
}) {
  const bonusContent = MoveContentCallbacks[opts.move?.Name || '']?.call(
    this,
    opts
  )
  const content = await renderTemplate(
    'systems/foundry-ironsworn/templates/chat/move.hbs',
    {
      ...opts,
      bonusContent,
    }
  )
  ChatMessage.create({
    speaker: ChatMessage.getSpeaker(),
    content,
  })
}

export async function createStarforgedMoveRollChat(
  params: SFRollMessageParams
) {
  await params.roll.evaluate({ async: true })
  const {
    actionScore: action,
    actionScoreCapped: actionCapped,
    canceledActionDie,
    challengeDie1,
    challengeDie2,
    match,
  } = calculateDieTotals(params.roll)

  // Momentum: if this is not a progress roll, it might be possible to upgrade
  let hitType = computeRollOutcome(action, challengeDie1, challengeDie2)
  const momentumProps = calculateMomentumProps(params.roll, params.actor)
  if (momentumProps.negativeMomentumCancel) {
    hitType = computeRollOutcome(
      canceledActionDie,
      challengeDie1,
      challengeDie2
    )
  }

  const renderData = {
    themeClass: `theme-${IronswornSettings.theme}`,
    action,
    actionCapped,
    hitType: computeOutcomeText(hitType, match),
    title: calculateSFCardTitle(params),
    resultText: calculateSFMoveResultText(hitType, match, params.move),
    nextOracles: await sfNextOracles(params.move),
    ...momentumProps,
    ...params,
  }
  const content = await renderTemplate(
    'systems/foundry-ironsworn/templates/chat/roll-sf.hbs',
    renderData
  )

  const messageData = {
    speaker: ChatMessage.getSpeaker(),
    content,
    type: CONST.CHAT_MESSAGE_TYPES.ROLL,
    roll: params.roll,
  }

  const cls = CONFIG.ChatMessage.documentClass
  return cls.create(messageData as any, {})
}

interface FeatureChatInput {
  roll: Roll
  theme?: IronswornItem
  domain?: IronswornItem
  feature: FeatureOrDanger
}

export async function createIronswornFeatureChat(params: FeatureChatInput) {
  const content = await renderTemplate(
    'systems/foundry-ironsworn/templates/chat/delve-feature.hbs',
    params
  )
  ChatMessage.create({
    speaker: ChatMessage.getSpeaker(),
    content,
    type: CONST.CHAT_MESSAGE_TYPES.ROLL,
    roll: params.roll,
  } as any)
}

interface DenizenChatInput {
  roll: Roll
  site: IronswornActor
  denizen: DenizenSlot
}

export async function createIronswornDenizenChat(params: DenizenChatInput) {
  const content = await renderTemplate(
    'systems/foundry-ironsworn/templates/chat/denizen.hbs',
    params
  )
  ChatMessage.create({
    speaker: ChatMessage.getSpeaker(),
    content,
    type: CONST.CHAT_MESSAGE_TYPES.ROLL,
    roll: params.roll,
  } as any)
}

export async function rollAndDisplayOracleResult(
  table?: RollTable,
  packName?: string
): Promise<string | undefined> {
  console.log(table)
  if (!table) {
    return undefined
  }

  // Do the random roll
  // FIXME this typing is pretty gross, but exists as a workaround for an error in the LoFD typings package (as of 17 Jun 2022). it can be removed once that's fixed.
  const tableDraw = await table.draw({
    displayChat: false,
  } as RollTable.DrawOptions)

  // Parse the table rows
  const tableRows = sortBy(
    table.data.results.contents.map((x) => ({
      low: x.data.range[0],
      high: x.data.range[1],
      text: marked.parseInline(x.data.text),
      selected: false,
    })),
    'low'
  )

  // Grab the relevant rows
  const roll = tableDraw.roll as Evaluated<Roll>
  const resultRow = tableRows.find(
    (x) => x.low <= roll.total && roll.total <= x.high
  ) as { low: number; high: number; text: string; selected: boolean }
  const resultIdx = tableRows.indexOf(resultRow)
  const displayRows = compact([
    tableRows[resultIdx - 1],
    { ...resultRow, selected: true },
    tableRows[resultIdx + 1],
  ])

  // Calculate the "path" to this oracle
  const oracleTreeRoot = await createStarforgedOracleTree()
  const pathElements = findPathToNodeByTableId(oracleTreeRoot, table.id || '')
  const pathNames = pathElements.map((x) => x.displayName)
  pathNames.shift() // root node has no display name
  pathNames.pop() // this is the one we rolled, it gets the main title

  // Render the chat message content
  const renderData = {
    themeClass: `theme-${IronswornSettings.theme}`,
    table,
    packName,
    oraclePath: pathNames.join(' / '),
    roll,
    displayRows,
    result: tableDraw.results[0],
  }
  const content = await renderTemplate(
    'systems/foundry-ironsworn/templates/chat/oracle-roll.hbs',
    renderData
  )

  // Send out the chat card
  const messageData = {
    user: game.user,
    speaker: ChatMessage.getSpeaker(),
    type: CONST.CHAT_MESSAGE_TYPES.ROLL,
    roll: tableDraw.roll,
    sound: tableDraw.roll ? CONFIG.sounds.dice : null,
    content,
  } as any
  await ChatMessage.create(messageData)

  // Return the raw text
  return resultRow?.text
}
