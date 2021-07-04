import { IronswornActor } from '../actor/actor'
import { EnhancedDataswornMove } from '../helpers/data'
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

function dieTotals(roll: any): { action: number; challenge1: number; challenge2: number } {
  const challengeDice = challengeRoll(roll)
  return {
    action: actionRoll(roll).total as number,
    challenge1: challengeDice[0].total as number,
    challenge2: challengeDice[1].total as number,
  }
}

function hitTypeForRoll(roll: Roll): string {
  const { action, challenge1, challenge2 } = dieTotals(roll)
  const match = challenge1 === challenge2
  if (action <= Math.min(challenge1, challenge2)) {
    return game.i18n.localize(match ? 'IRONSWORN.Complication' : 'IRONSWORN.Miss')
  }
  if (action > Math.max(challenge1, challenge2)) {
    return game.i18n.localize(match ? 'IRONSWORN.Opportunity' : 'IRONSWORN.StrongHit')
  }
  return game.i18n.localize('IRONSWORN.WeakHit')
}

export async function createIronswornChatRoll(params: RollMessageParams) {
  await params.roll.evaluate({async: false} as any)
  const renderData = {
    speaker: ChatMessage.getSpeaker(),
    hitType: hitTypeForRoll(params.roll),
    ...params,
  }
  const content = await renderTemplate('systems/foundry-ironsworn/templates/chat/ironsworn-roll.hbs', renderData)

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
