import { IronswornActor } from '../actor/actor'
import { EnhancedDataswornMove } from '../helpers/data'
import { IronswornSettings } from '../helpers/settings'
import { capitalize } from '../helpers/util'
import { IronswornItem } from '../item/item'

interface RollMessageParams {
  roll: Roll
  actor?: IronswornActor
  asset?: IronswornItem
  move?: EnhancedDataswornMove
  stat?: string
  bonus?: number
}

function actionRoll(roll: any): Roll {
  return roll.terms[0].rolls.find((x) => x.dice.length === 0 || x.dice[0].faces === 6)
}

function challengeRoll(roll: any): [Roll, Roll] {
  return roll.terms[0].rolls.filter((x) => x.dice.length > 0 && x.dice[0].faces === 10)
}

interface DitTotals {
  action: number
  challenge1: number
  challenge2: number
  match: boolean
}

function dieTotals(roll: any): DitTotals {
  const challengeDice = challengeRoll(roll)
  const [challenge1, challenge2] = challengeDice.map((x) => x.total as number)
  return {
    action: actionRoll(roll).total as number,
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

function hitType(roll: Roll, override?: number): HIT_TYPE {
  const { action, challenge1, challenge2 } = dieTotals(roll)
  const realAction = override || action

  if (realAction <= Math.min(challenge1, challenge2)) return HIT_TYPE.MISS
  if (realAction > Math.max(challenge1, challenge2)) return HIT_TYPE.STRONG
  return HIT_TYPE.WEAK
}

function hitTypeText(roll: Roll, override?: number) {
  const { match } = dieTotals(roll)
  const hit = hitType(roll, override)
  if (hit === HIT_TYPE.MISS) {
    return game.i18n.localize(match ? 'IRONSWORN.Complication' : 'IRONSWORN.Miss')
  }
  if (hit === HIT_TYPE.STRONG) {
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

  const rollText = game.i18n.localize('IRONSWORN.Roll')
  if (params.stat) {
    const statText = game.i18n.localize(`IRONSWORN.${capitalize(params.stat)}`)
    return `${rollText} +${statText}`
  }

  return rollText
}

function generateResultText(roll: Roll, move?: EnhancedDataswornMove, override?: number): string | undefined {
  if (!move) return undefined

  switch (hitType(roll, override)) {
    case HIT_TYPE.MISS: return move.Miss
    case HIT_TYPE.WEAK: return move.Weak
    case HIT_TYPE.STRONG: return move.Strong
  }
}

interface MomentumProps {
  momentumHitType?: string
  momentumResultText?: string
}
function momentumProps(roll: Roll, actor?: IronswornActor, move?: EnhancedDataswornMove): MomentumProps {
  if (!actor || actor.data.type !== 'character') return {}
  const momentum = actor.data.data.momentum
  const originalHitType = hitType(roll)
  const momentumHitType = hitType(roll, momentum)
  const momentumHitTypeText = hitTypeText(roll, momentum)

  switch (`${originalHitType} -> ${momentumHitType}`) {
    case 'MISS -> STRONG':
    case 'MISS -> WEAK':
    case 'WEAK -> STRONG':
      return {
        momentumHitType: momentumHitTypeText,
        momentumResultText: generateResultText(roll, move, momentum) || momentumHitTypeText,
      }
    default:
      return {}
  }
}

export async function createIronswornChatRoll(params: RollMessageParams) {
  await params.roll.evaluate({ async: false })
  const renderData = {
    themeClass: `theme-${IronswornSettings.theme}`,
    hitType: hitTypeText(params.roll),
    title: generateCardTitle(params),
    resultText: generateResultText(params.roll, params.move),
    ...momentumProps(params.roll, params.actor, params.move),
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

// Crack open that message type
declare global {
  interface ChatMessage {
    move?: EnhancedDataswornMove
  }
}
