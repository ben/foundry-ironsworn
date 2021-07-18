import { IronswornActor } from '../actor/actor'
import { EnhancedDataswornMove } from '../helpers/data'
import { IronswornSettings } from '../helpers/settings'
import { capitalize } from '../helpers/util'
import { IronswornItem } from '../item/item'
import { FeatureOrDanger } from '../item/itemtypes'

interface RollMessageParams {
  roll: Roll
  actor?: IronswornActor
  asset?: IronswornItem
  move?: EnhancedDataswornMove
  stat?: string
  bonus?: number
  progress?: IronswornItem
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
  const rawActionDie = actionDie.terms.find(x => x instanceof Die)

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

enum HIT_TYPE {
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

function generateCardTitle(params: RollMessageParams) {
  if (params.move) {
    let title = params.move.Name
    if (params.stat) {
      title += ` (${params.stat})`
    }
    return title
  }

  if (params.asset) {
    let title = params.asset.data.name
    if (params.stat) {
      if (params.stat === 'track' && params.asset?.data.type === 'asset') {
        title += ` (${params.asset.data.data.track.name})`
      } else {
        const statText = game.i18n.localize(`IRONSWORN.${capitalize(params.stat)}`)
        title += `(${statText})`
      }
    }
    return title
  }

  if (params.progress) {
    return `${game.i18n.localize('IRONSWORN.ProgressRoll')}: ${params.progress.name}`
  }

  const rollText = game.i18n.localize('IRONSWORN.Roll')
  if (params.stat) {
    const statText = game.i18n.localize(`IRONSWORN.${capitalize(params.stat)}`)
    return `${rollText} +${statText}`
  }

  return rollText
}

function calculateMoveResultText(type: HIT_TYPE, move?: EnhancedDataswornMove): string | undefined {
  if (!move) return undefined

  switch (type) {
    case HIT_TYPE.MISS: return move.Miss
    case HIT_TYPE.WEAK: return move.Weak
    case HIT_TYPE.STRONG: return move.Strong
  }
}

interface MomentumProps {
  momentumHitType?: string
  momentumResultText?: string
  negativeMomentumCancel?: boolean
}
function calculateMomentumProps(roll: Roll, actor?: IronswornActor, move?: EnhancedDataswornMove): MomentumProps {
  if (!actor || actor.data.type !== 'character') return {}
  const { action, rawAction, challenge1, challenge2, match } = calculateDieTotals(roll)

  const momentum = actor.data.data.momentum
  if (momentum < 0 && -momentum === rawAction)
    return {
      negativeMomentumCancel: true,
    }

  const originalHitType = calculateHitType(action, challenge1, challenge2)
  const momentumHitType = calculateHitType(momentum, challenge1, challenge2)
  const momentumHitTypeText = calculateHitTypeText(momentumHitType, match)

  switch (`${originalHitType} -> ${momentumHitType}`) {
    case 'MISS -> STRONG':
    case 'MISS -> WEAK':
    case 'WEAK -> STRONG':
      return {
        momentumHitType: momentumHitTypeText,
        momentumResultText: calculateMoveResultText(momentumHitType, move) || momentumHitTypeText,
      }
    default:
      return {}
  }
}

export async function createIronswornChatRoll(params: RollMessageParams) {
  await params.roll.evaluate({ async: false })
  const { action, canceledAction, challenge1, challenge2, match } = calculateDieTotals(params.roll)

  // Momentum: if this is not a progress roll, it might be possible to upgrade
  let hitType = calculateHitType(action, challenge1, challenge2)
  let momentumProps: MomentumProps = {}
  if (!params.progress) {
    momentumProps = calculateMomentumProps(params.roll, params.actor, params.move)
    if (momentumProps.negativeMomentumCancel) {
      hitType = calculateHitType(canceledAction, challenge1, challenge2)
    }
  }

  const renderData = {
    themeClass: `theme-${IronswornSettings.theme}`,
    hitType: calculateHitTypeText(hitType, match),
    title: generateCardTitle(params),
    resultText: calculateMoveResultText(hitType, params.move),
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

  // CONFIG.ChatMessage.documentClass.create(...)
  const cls = CONFIG.ChatMessage.documentClass
  const message = await cls.create(messageData as any, {})
  if (message) message.move = params.move
}

export async function createIronswornMoveChat(move: EnhancedDataswornMove) {
  const content = await renderTemplate('systems/foundry-ironsworn/templates/chat/move.hbs', move)
  ChatMessage.create({
    speaker: ChatMessage.getSpeaker(),
    content,
  })
}

interface FeatureChatInput {
  roll: Roll
  item: IronswornItem
  feature: FeatureOrDanger
}

export async function createIronswornFeatureChat(params: FeatureChatInput) {
  const content = await renderTemplate('systems/foundry-ironsworn/templates/chat/delve-feature.hbs', params)
  ChatMessage.create({
    speaker: ChatMessage.getSpeaker(),
    content,
  })
}

// Crack open that message type
declare global {
  interface ChatMessage {
    move?: EnhancedDataswornMove
  }
}
