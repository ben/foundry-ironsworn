// TODO:
// - Convert to HTML for chat messages
// - Rehydrate from chat message (will be needed for rerolls)
// - Options input covers all cases
// - Rolling that plays nicer with DF Manual Rolls (all in one go, not {d6+N,d10,d10})
// - Rerolls update chat message

import { compact, pick, range, sum } from 'lodash'
import { getFoundryMoveByDfId } from '../dataforged'
import { IronswornItem } from '../item/item'
import { IronswornRollChatMessage } from './chat-message'

/**
 * The maximum action score (for Ironsworn action rolls) or progress score (for Ironsworn progress rolls).
 */
export const SCORE_MAX = 10
/**
 * The number of sides on an action die, used to make Ironsworn's action rolls.
 */
export const ACTION_DIE_SIDES = 6
/**
 * The number of sides on each challenge die, used in Ironsworn's action rolls and progress rolls.
 */
export const CHALLENGE_DIE_SIDES = 10

/**
 * The default number of challenge dice rolled in an Ironsworn action roll or progress roll
 */
export const CHALLENGE_DICE_ROLLED = 2

/**
 * The default number of action dice rolled in an Ironsworn action roll.
 */
export const ACTION_DICE_ROLLED = 1

/**
 * The minimum face value of a die.
 */
export const DIE_LOWEST_FACE = 1
// TODO: consider whether these would be useful as regexps instead?
export const ACTION_DIE_STR = `d${ACTION_DIE_SIDES}`
export const CHALLENGE_DIE_STR = `d${CHALLENGE_DIE_SIDES}`

export enum ROLL_OUTCOME {
  MISS = 'Miss',
  WEAK_HIT = 'Weak_hit',
  STRONG_HIT = 'Strong_hit',
}

export type SourcedValue<T = number> = {
  source: string
  value: T
}

/**
 * Input to rolling and resolution
 */
export interface PreRollOptions {
  // TODO: candidate for being a generic type with some variable props dependent on boolean "isProgressRoll"?
  /**
   * Exactly one of `progress` or `action` is required
   */

  /**
   * indicates this is a progress roll, no action die will be rolled
   */
  progress?: SourcedValue

  /**
   * Indicates this is an action roll
   */
  stat?: SourcedValue
  /**
   * Indicates this is an action roll
   */
  adds?: number

  /**
   * Negative momentum can cancel an action die
   */
  momentum?: number

  automaticOutcome?: SourcedValue<ROLL_OUTCOME>
  /**
   * As in Armored #1
   */
  presetActionDie?: SourcedValue
  /**
   * As in Sleuth #1
   */
  extraChallengeDice?: SourcedValue

  // Decided before the roll, but kept around for resolving updates later

  /**
   * For custom moves
   */
  moveId?: string
  /**
   * for "official" moves
   */
  moveDfId?: string
  actorId?: string
}

// Input to rendering, can be updated after the fact
export interface PostRollOptions {
  /**
   * As in Kinetic #2. if present and non-empty, will suggest in the chat-card UI
   */
  suggestedAdds?: SourcedValue[]
  adds?: SourcedValue[]

  /**
   * As in Loyalist #3
   */
  replacedChallenge1?: SourcedValue
  replacedChallenge2?: SourcedValue

  /**
   * As in Brawler #2 or Take Decisive Action
   */
  allowReplacingOutcome?: boolean
  replacedOutcome?: SourcedValue<ROLL_OUTCOME>
}
