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

export async function createIronswornChatRoll(params: RollMessageParams) {
  await params.roll.evaluate({ async: false } as any)
  const renderData = {
    hitType: hitTypeForRoll(params.roll),
    title: generateCardTitle(params),
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
