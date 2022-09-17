// TODO:
// - Convert to HTML for chat messages
// - Rehydrate from chat message (will be needed for rerolls)
// - Options input covers all cases
// - Rolling that plays nicer with DF Manual Rolls (all in one go, not {d6+N,d10,d10})
// - Rerolls update chat message

import { cloneDeep, compact, pick, range, sum } from 'lodash'
import { getFoundryMoveByDfId } from '../dataforged'
import { IronswornItem } from '../item/item'
import { computeRollOutcome } from './ironsworn-roll-message'

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

/**
 * Enumerates Ironsworn roll outcomes.
 * The key corresponds to the i18n key that labels this outcome.
 * The value is equal to the number of challenge dice beaten by the action score or progress score.
 */
export enum RollOutcome {
  /**
   * **Miss:** The score beats neither challenge die.
   */
  Miss = 0,
  /**
   * **Weak hit:** The score beats one challenge die.
   */
  Weak_hit = 1,
  /**
   * **Strong hit:** The score beats both challenge dice.
   */
  Strong_hit = 2,
}

/**
 * Enumerates Dataforged move outcome keys using the same values as {@link RollOutcome}
 */
export enum DfRollOutcome {
  /**
   * **Miss:** The score beats neither challenge die.
   */
  Miss = 0,
  /**
   * **Weak hit:** The score beats one challenge die.
   */
  'Weak Hit' = 1,
  /**
   * **Strong hit:** The score beats both challenge dice.
   */
  'Strong Hit' = 2,
}

// TODO: consider differentiating `source` from a new prop called e.g. `label`; it's pulling double duty now as both as something being tested for internal logic *and* as a user-facing label. even if those are mutually exclusive categories right now, it might be risky in the long term to conflate them.
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

  automaticOutcome?: SourcedValue<RollOutcome>
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
  replacedOutcome?: SourcedValue<RollOutcome>
}

export class IronswornRoll {
  rawActionDieValue?: number
  rawChallengeDiceValues?: number[]
  preRollOptions: PreRollOptions
  postRollOptions: PostRollOptions

  roll?: Roll
  chatMessageId?: string

  constructor(
    preRollOpts: PreRollOptions = {},
    postRollOpts: PostRollOptions = {}
  ) {
    this.preRollOptions = preRollOpts
    this.postRollOptions = postRollOpts
  }

  static progress(source: string, progressScore: number): IronswornRoll {
    const r = new IronswornRoll()
    r.preRollOptions = {
      progress: {
        source,
        value: progressScore,
      },
    }
    return r
  }

  async evaluate() {
    if (
      this.roll ||
      (this.rawChallengeDiceValues && this.rawChallengeDiceValues.length > 0)
    ) {
      return
    }

    // VALIDATE
    const isProgress = this.preRollOptions.progress !== undefined
    const isStat = this.preRollOptions.stat !== undefined
    if ([isProgress, isStat].filter((x) => x).length !== 1) {
      throw new TypeError(
        'Exactly one of `stat` and `progress` are required here'
      )
    }

    // Gather the dice we need to roll
    const diceTerms = [] as string[]
    if (this.preRollOptions.stat && !this.preRollOptions.presetActionDie) {
      diceTerms.push('d6')
    }
    const numChallengeDice =
      2 + (this.preRollOptions.extraChallengeDice?.value ?? 0)
    diceTerms.push(...range(0, numChallengeDice).map((_) => 'd10'))

    // Roll 'em
    this.roll = new Roll(`{${diceTerms.join(', ')}}`)
    await this.roll.roll({ async: true })

    // Pull out raw results
    const pool = this.roll.terms[0] as PoolTerm
    const actionRoll = pool.rolls.find((x) => x.formula === '1d6')
    this.rawActionDieValue = actionRoll?.total
    const challengeRolls = pool.rolls.filter((x) => x.formula === '1d10')
    this.rawChallengeDiceValues = challengeRolls.map((x) => x.total as number)
  }

  serialize() {
    return pick(this, [
      'preRollOptions',
      'postRollOptions',
      'rawActionDieValue',
      'rawChallengeDiceValues',
    ])
  }

  get actionDie(): SourcedValue | undefined {
    if (this.preRollOptions.presetActionDie) {
      return this.preRollOptions.presetActionDie
    }

    if (this.preRollOptions.progress) {
      return this.preRollOptions.progress
    }

    if (this.rawActionDieValue) {
      return {
        source: 'd6',
        value: this.rawActionDieValue, // TODO: post-roll override
      }
    }

    return undefined
  }

  get canceledByNegativeMomentum(): boolean {
    if (this.actionDie) {
      return this.preRollOptions.momentum === -this.actionDie.value
    }
    // Unresolved rolls can't be canceled
    return false
  }

  get adds(): Array<SourcedValue<string | number>> {
    const ret: Array<SourcedValue<string | number>> = []

    if (this.preRollOptions.stat) {
      ret.push(this.preRollOptions.stat)
    } else if (this.preRollOptions.moveDfId || this.preRollOptions.moveId) {
      // move rolls will always add a stat
      ret.push({
        source: 'Select a stat',
        value: `(${game.i18n.localize('IRONSWORN.Stat')})`,
      })
    }

    if (this.preRollOptions.adds) {
      ret.push({
        source: game.i18n.localize('IRONSWORN.Adds'),
        value: this.preRollOptions.adds,
      })
    }

    ret.push(...(this.postRollOptions.adds ?? []))

    return ret
  }

  private get rawScore(): number | undefined {
    const terms = [] as Array<number | undefined>

    // First term: progress score or action-die roll
    if (this.preRollOptions.presetActionDie) {
      terms.push(
        this.canceledByNegativeMomentum
          ? 0
          : this.preRollOptions.presetActionDie.value
      )
    } else if (this.preRollOptions.progress) {
      terms.push(this.preRollOptions.progress.value)
    } else if (this.rawActionDieValue !== undefined) {
      terms.push(this.canceledByNegativeMomentum ? 0 : this.rawActionDieValue)
    } else terms.push(undefined) // Not rolled yet

    // Second term: the stat for an action roll
    if (this.preRollOptions.stat) {
      terms.push(this.preRollOptions.stat.value)
    } else if (this.moveItem && !this.preRollOptions.progress) {
      // This is a move roll (not Fulfill Your Vow), but the action input
      // isn't set, which means we haven't rolled yet
      terms.push(undefined)
    }

    // Third term: all other adds
    terms.push(this.preRollOptions.adds ?? 0)

    // Will it add?
    if (terms.every((x) => x !== undefined)) {
      return sum(terms)
    }
    return undefined
  }

  get score(): number | undefined {
    const ret = this.rawScore
    return ret === undefined ? undefined : Math.min(ret, SCORE_MAX)
  }

  get actionScoreCapped(): boolean {
    return (this.rawScore ?? 0) > SCORE_MAX
  }

  get challengeDice(): SourcedValue<number | undefined>[] {
    if (this.rawChallengeDiceValues !== undefined) {
      // challenge dice have been rolled, report them
      return this.rawChallengeDiceValues.map((x) => ({
        source: 'd10',
        value: x,
      }))
    }

    // Not rolled yet. Definitely include two, then maybe some extras
    const ret = [
      { source: '', value: undefined },
      { source: '', value: undefined },
    ] as SourcedValue<number | undefined>[]
    if (this.preRollOptions.extraChallengeDice) {
      for (let i = 0; i < this.preRollOptions.extraChallengeDice.value; i++) {
        ret.push({
          source: game.i18n.localize('IRONSWORN.RollDialog.ExtraChallengeDice'),
          value: undefined,
        })
      }
    }
    return ret
  }

  // Either [N,N] or undefined
  get finalChallengeDice(): undefined | [SourcedValue, SourcedValue] {
    const replaced = compact([
      this.postRollOptions.replacedChallenge1,
      this.postRollOptions.replacedChallenge2,
    ])
    if (replaced.length === 2) {
      return replaced as [SourcedValue, SourcedValue]
    }
    if (this.rawChallengeDiceValues?.length === 2) {
      return this.rawChallengeDiceValues.map((d) => ({
        source: 'd10',
        value: d,
      })) as [SourcedValue, SourcedValue]
    }
    return undefined
  }

  get isMatch(): boolean {
    if (!this.finalChallengeDice) return false
    const [c1, c2] = this.finalChallengeDice ?? []
    return c1 !== undefined && c1.value === c2.value
  }

  get rawOutcome(): SourcedValue<RollOutcome> | undefined {
    if (this.preRollOptions.automaticOutcome) {
      return this.preRollOptions.automaticOutcome
    }
    if (!this.finalChallengeDice || this.score === undefined) return undefined

    const [c1, c2] = this.finalChallengeDice
    const outcome = computeRollOutcome(this.score, c1.value, c2.value)
    return {
      value: outcome,
      source: game.i18n.localize('IRONSWORN.Roll'),
    }
  }

  get finalOutcome(): SourcedValue<RollOutcome> | undefined {
    if (typeof this.postRollOptions.replacedOutcome?.value === 'number') {
      return this.postRollOptions.replacedOutcome
    }
    return this.rawOutcome
  }

  get moveItem(): Promise<IronswornItem | undefined> | undefined {
    const { moveDfId, moveId } = this.preRollOptions
    if (moveDfId) return getFoundryMoveByDfId(moveDfId)
    if (moveId) return Promise.resolve(game.items?.get(moveId))
    return undefined
  }

  static fromJson(json: object): IronswornRoll {
    const ir = new IronswornRoll()
    Object.assign(ir, json)
    return ir
  }

  clone(): IronswornRoll {
    const json = this.serialize()
    return IronswornRoll.fromJson(cloneDeep(json))
  }
}
