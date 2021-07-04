import { IronswornActor } from '../actor/actor'
import { EnhancedDataswornMove } from '../helpers/data'
import { capitalize } from '../helpers/util'
import { AssetItemData } from '../item/itemtypes'

interface RollMessageParams {
  roll: Roll
  actor?: IronswornActor
  asset?: Item<AssetItemData>
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

function hitType(roll: Roll): HIT_TYPE {
  const { action, challenge1, challenge2 } = dieTotals(roll)

  if (action <= Math.min(challenge1, challenge2)) return HIT_TYPE.MISS
  if (action > Math.max(challenge1, challenge2)) return HIT_TYPE.STRONG
  return HIT_TYPE.WEAK
}

function hitTypeText(roll: Roll) {
  const { match } = dieTotals(roll)
  const hit = hitType(roll)
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
    const assetData = params.asset.data as AssetItemData
    let title = params.asset.data.name
    if (params.stat) {
      if (params.stat === 'track') {
        title += ` (${assetData.data.track.name})`
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

function generateResultText(roll: Roll, move?: EnhancedDataswornMove): string | undefined {
  if (!move) return undefined

  switch (hitType(roll)) {
    case HIT_TYPE.MISS: return move.Miss
    case HIT_TYPE.WEAK: return move.Weak
    case HIT_TYPE.STRONG: return move.Strong
  }
}

export async function createIronswornChatRoll(params: RollMessageParams) {
  await params.roll.evaluate({ async: false } as any)
  const renderData = {
    hitType: hitTypeText(params.roll),
    title: generateCardTitle(params),
    resultText: generateResultText(params.roll, params.move),
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
  const cls = CONFIG.ChatMessage.entityClass as any
  cls.create(messageData, {})
}

export async function createIronswornMoveChat(move:EnhancedDataswornMove) {
  const content = await renderTemplate('systems/foundry-ironsworn/templates/chat/move.hbs', move)
  ChatMessage.create({
    speaker: ChatMessage.getSpeaker(),
    content
  })
}
