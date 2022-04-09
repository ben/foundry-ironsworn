import { IronswornActor } from '../actor/actor'
import { DenizenSlot } from '../actor/actortypes'
import { EnhancedDataswornMove } from '../helpers/data'
import { IronswornSettings } from '../helpers/settings'
import { capitalize } from '../helpers/util'
import { IronswornItem } from '../item/item'
import { FeatureOrDanger, SFMoveDataProperties } from '../item/itemtypes'
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
  bonus: number
}

function actionRoll(roll: any): Roll {
  return roll.terms[0].rolls.find((x) => x.dice.length === 0 || x.dice[0].faces === 6)
}

function challengeRoll(roll: any): [Roll, Roll] {
  return roll.terms[0].rolls.filter((x) => x.dice.length > 0 && x.dice[0].faces === 10)
}

interface DieTotals {
  action: number
  rawAction: number
  canceledAction: number
  challenge1: number
  challenge2: number
  match: boolean
}

function calculateDieTotals(roll: Roll): DieTotals {
  const actionDie = actionRoll(roll)
  const challengeDice = challengeRoll(roll)
  const [challenge1, challenge2] = challengeDice.map((x) => x.total as number)
  const rawActionDie = actionDie.terms.find((x) => x instanceof Die)

  const canceledActionDie = new Roll(actionDie.formula.replace('1d6', '0'))
  canceledActionDie.evaluate({ async: false })

  return {
    action: actionDie.total as number,
    rawAction: rawActionDie?.total as number,
    canceledAction: canceledActionDie.total as number,
    challenge1,
    challenge2,
    match: challenge1 === challenge2,
  }
}

export enum HIT_TYPE {
  MISS = 'MISS',
  WEAK = 'WEAK',
  STRONG = 'STRONG',
}

function calculateHitType(action: number, challenge1: number, challenge2: number): HIT_TYPE {
  if (action <= Math.min(challenge1, challenge2)) return HIT_TYPE.MISS
  if (action > Math.max(challenge1, challenge2)) return HIT_TYPE.STRONG
  return HIT_TYPE.WEAK
}

function calculateHitTypeText(type: HIT_TYPE, match: boolean) {
  if (type === HIT_TYPE.MISS) {
    return game.i18n.localize(match ? 'IRONSWORN.Complication' : 'IRONSWORN.Miss')
  }
  if (type === HIT_TYPE.STRONG) {
    return game.i18n.localize(match ? 'IRONSWORN.Opportunity' : 'IRONSWORN.StrongHit')
  }
  return game.i18n.localize('IRONSWORN.WeakHit')
}

function calculateCardTitle(params: RollMessageParams) {
  if (params.move) {
    let title = game.i18n.localize(`IRONSWORN.MoveContents.${params.move.Name}.title`)
    if (title.startsWith('IRONSWORN.')) {
      title = params.move.Name
    }

    if (params.stat) {
      title += ` (${game.i18n.localize('IRONSWORN.' + capitalize(params.stat))})`
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
        title += ` (${params.asset.data.data.track.name})`
      } else {
        const statText = game.i18n.localize(`IRONSWORN.${capitalize(params.stat)}`)
        title += ` (${statText})`
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
  return `${params.move.name} (${game.i18n.localize('IRONSWORN.' + capitalize(params.stats[0]))})`
}

function calculateMoveResultText(type: HIT_TYPE, move?: EnhancedDataswornMove): string | undefined {
  if (!move) return undefined

  switch (type) {
    case HIT_TYPE.MISS:
      return move.Miss
    case HIT_TYPE.WEAK:
      return move.Weak
    case HIT_TYPE.STRONG:
      return move.Strong
  }
}

function calculateSFMoveResultText(type: HIT_TYPE, match: boolean, move: IronswornItem) {
  const data = move.data as SFMoveDataProperties
  const outcomeKey = {
    [HIT_TYPE.MISS]: 'Miss',
    [HIT_TYPE.WEAK]: 'Weak Hit',
    [HIT_TYPE.STRONG]: 'Strong Hit',
  }[type]
  let outcome = data.data.Outcomes?.[outcomeKey]
  if (match) outcome = outcome?.['With a Match'] ?? outcome
  return outcome?.Text
}

interface MomentumProps {
  momentumHitType?: HIT_TYPE
  momentumHitTypeI18n?: string
  negativeMomentumCancel?: boolean
}
function calculateMomentumProps(roll: Roll, actor?: IronswornActor): MomentumProps {
  if (!actor || actor.data.type !== 'character') return {}
  const { action, rawAction, challenge1, challenge2, match } = calculateDieTotals(roll)

  const momentum = actor.data.data.momentum
  if (momentum < 0 && -momentum === rawAction)
    return {
      negativeMomentumCancel: true,
    }

  const originalHitType = calculateHitType(action, challenge1, challenge2)
  const momentumHitType = calculateHitType(momentum, challenge1, challenge2)
  const momentumHitTypeI18n = calculateHitTypeText(momentumHitType, match)

  switch (`${originalHitType} -> ${momentumHitType}`) {
    case 'MISS -> STRONG':
    case 'MISS -> WEAK':
    case 'WEAK -> STRONG':
      return {
        momentumHitType,
        momentumHitTypeI18n,
      }
    default:
      return {}
  }
}

export async function createIronswornChatRoll(params: RollMessageParams) {
  await params.roll.evaluate({ async: true })
  const { action, canceledAction, challenge1, challenge2, match } = calculateDieTotals(params.roll)

  // Momentum: if this is not a progress roll, it might be possible to upgrade
  let hitType = calculateHitType(action, challenge1, challenge2)
  let momentumProps: MomentumProps = {}
  if (!params.isProgress) {
    momentumProps = calculateMomentumProps(params.roll, params.actor)
    if (momentumProps.negativeMomentumCancel) {
      hitType = calculateHitType(canceledAction, challenge1, challenge2)
    }
  }

  const bonusContent = MoveContentCallbacks[params.move?.Name || '']?.call(this, { hitType, stat: params.stat })

  const renderData = {
    themeClass: `theme-${IronswornSettings.theme}`,
    hitType: calculateHitTypeText(hitType, match),
    title: calculateCardTitle(params),
    resultText: calculateMoveResultText(hitType, params.move),
    bonusContent,
    ...momentumProps,
    ...params,
  }
  const content = await renderTemplate('systems/foundry-ironsworn/templates/chat/roll.hbs', renderData)

  const messageData = {
    speaker: ChatMessage.getSpeaker(),
    content,
    type: CONST.CHAT_MESSAGE_TYPES.ROLL,
    roll: params.roll,
  }

  const cls = CONFIG.ChatMessage.documentClass
  return cls.create(messageData as any, {})
}

export async function createIronswornMoveChat(opts: { move?: EnhancedDataswornMove; site?: IronswornActor }) {
  const bonusContent = MoveContentCallbacks[opts.move?.Name || '']?.call(this, opts)
  const content = await renderTemplate('systems/foundry-ironsworn/templates/chat/move.hbs', { ...opts, bonusContent })
  ChatMessage.create({
    speaker: ChatMessage.getSpeaker(),
    content,
  })
}

export async function createStarforgedMoveRollChat(params: SFRollMessageParams) {
  await params.roll.evaluate({ async: true })
  const { action, canceledAction, challenge1, challenge2, match } = calculateDieTotals(params.roll)

  // Momentum: if this is not a progress roll, it might be possible to upgrade
  let hitType = calculateHitType(action, challenge1, challenge2)
  const momentumProps = calculateMomentumProps(params.roll, params.actor)
  if (momentumProps.negativeMomentumCancel) {
    hitType = calculateHitType(canceledAction, challenge1, challenge2)
  }

  const renderData = {
    themeClass: `theme-${IronswornSettings.theme}`,
    hitType: calculateHitTypeText(hitType, match),
    title: calculateSFCardTitle(params),
    resultText: calculateSFMoveResultText(hitType, match, params.move),
    ...momentumProps,
    ...params,
  }
  const content = await renderTemplate('systems/foundry-ironsworn/templates/chat/roll.hbs', renderData)

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
  const content = await renderTemplate('systems/foundry-ironsworn/templates/chat/delve-feature.hbs', params)
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
  const content = await renderTemplate('systems/foundry-ironsworn/templates/chat/denizen.hbs', params)
  ChatMessage.create({
    speaker: ChatMessage.getSpeaker(),
    content,
    type: CONST.CHAT_MESSAGE_TYPES.ROLL,
    roll: params.roll,
  } as any)
}

// Crack open that message type
// declare global {
//   interface ChatMessage {
//   }
// }
