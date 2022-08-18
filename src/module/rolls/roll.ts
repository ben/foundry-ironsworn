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

export enum ROLL_OUTCOME {
  MISS = 'MISS',
  WEAK = 'WEAK',
  STRONG = 'STRONG',
}

export type SourcedValue<T = number> = {
  source: string
  value: T
}

// Input to rolling and resolution
export interface PreRollOptions {
  // Exactly one of `progress` or `action` is required

  // indicates this is a progress roll, no action die will be rolled
  progress?: SourcedValue

  // Indicates this is an action roll
  action?: SourcedValue
  adds?: number

  // Negative momentum can cancel an action die
  momentum?: number

  automaticOutcome?: SourcedValue<ROLL_OUTCOME>
  // As in Armored #1
  presetActionDie?: SourcedValue
  // As in Sleuth #1
  extraChallengeDice?: SourcedValue

  // Decided before the roll, but kept around for resolving updates later
  moveId?: string // For custom moves
  moveDfId?: string // for "official" moves
  actorId?: string
}

// Input to rendering, can be updated after the fact
export interface PostRollOptions {
  // As in Kinetic #2
  // if present and non-empty, will suggest in the chat-card UI
  suggestedAdds?: SourcedValue[]
  adds?: SourcedValue[]

  // As in Loyalist #3
  replacedChallenge1?: SourcedValue
  replacedChallenge2?: SourcedValue

  // As in Brawler #2 or Take Decisive Action
  allowReplacingOutcome?: boolean
  replacedOutcome?: SourcedValue<ROLL_OUTCOME>
}

export class IronswornRoll {
  rawActionValue?: number
  rawChallengeValues?: number[]
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

  static action(stat: string, value: number, adds?: number): IronswornRoll {
    const r = new IronswornRoll()
    r.preRollOptions = {
      action: {
        source: stat,
        value,
      },
      adds,
    }
    return r
  }

  static progress(source: string, value: number): IronswornRoll {
    const r = new IronswornRoll()
    r.preRollOptions = {
      progress: {
        source,
        value,
      },
    }
    return r
  }

  async evaluate() {
    if (
      this.roll ||
      (this.rawChallengeValues && this.rawChallengeValues.length > 0)
    ) {
      return
    }

    // VALIDATE
    const isProgress = this.preRollOptions.progress !== undefined
    const isAction = this.preRollOptions.action !== undefined
    if ([isProgress, isAction].filter((x) => x).length !== 1) {
      throw new TypeError(
        'Exactly one of `action` and `progress` are required here'
      )
    }

    // Gather the dice we need to roll
    const diceTerms = [] as string[]
    if (this.preRollOptions.action && !this.preRollOptions.presetActionDie) {
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
    this.rawActionValue = actionRoll?.total
    const challengeRolls = pool.rolls.filter((x) => x.formula === '1d10')
    this.rawChallengeValues = challengeRolls.map((x) => x.total as number)
  }

  serialize() {
    return pick(this, [
      'preRollOptions',
      'postRollOptions',
      'rawActionValue',
      'rawChallengeValues',
    ])
  }

  get actionDie(): SourcedValue | undefined {
    if (this.preRollOptions.presetActionDie) {
      return this.preRollOptions.presetActionDie
    }

    if (this.preRollOptions.progress) {
      return this.preRollOptions.progress
    }

    if (this.rawActionValue) {
      return {
        source: 'd6',
        value: this.rawActionValue, // TODO: post-roll override
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

    if (this.preRollOptions.action) {
      ret.push(this.preRollOptions.action)
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

  private get rawActionTotal(): number | undefined {
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
    } else if (this.rawActionValue !== undefined) {
      terms.push(this.canceledByNegativeMomentum ? 0 : this.rawActionValue)
    } else terms.push(undefined) // Not rolled yet

    // Second term: the stat for an action roll
    if (this.preRollOptions.action) {
      terms.push(this.preRollOptions.action.value)
    } else if (this.moveItem) {
      // This is a move, but the action input isn't set, which means we haven't rolled yet
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

  get actionTotal(): number | undefined {
    const ret = this.rawActionTotal
    return ret === undefined ? undefined : Math.min(ret, 10)
  }

  get actionTotalCapped(): boolean {
    return (this.rawActionTotal ?? 0) > 10
  }

  get challengeDice(): SourcedValue<number | undefined>[] {
    if (this.rawChallengeValues !== undefined) {
      // challenge dice have been rolled, report them
      return this.rawChallengeValues.map((x) => ({
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
  get finalChallengeDice(): undefined | number[] {
    const replaced = compact([
      this.postRollOptions.replacedChallenge1,
      this.postRollOptions.replacedChallenge2,
    ])
    if (replaced.length === 2) {
      return replaced.map((x) => x.value)
    }
    if (this.rawChallengeValues?.length === 2) {
      return this.rawChallengeValues
    }
    return undefined
  }

  get isMatch(): boolean {
    if (!this.finalChallengeDice) return false
    const [c1, c2] = this.finalChallengeDice ?? []
    return c1 === c2
  }

  get preAdjustmentOutcome(): SourcedValue<ROLL_OUTCOME> | undefined {
    if (this.preRollOptions.automaticOutcome) {
      return this.preRollOptions.automaticOutcome
    }
    if (!this.finalChallengeDice || this.actionTotal === undefined)
      return undefined

    const [c1, c2] = this.finalChallengeDice
    let outcome = ROLL_OUTCOME.WEAK
    if (this.actionTotal <= Math.min(c1, c2)) outcome = ROLL_OUTCOME.MISS
    if (this.actionTotal > Math.max(c1, c2)) outcome = ROLL_OUTCOME.STRONG
    return {
      value: outcome,
      source: game.i18n.localize('IRONSWORN.Roll'),
    }
  }

  get postAdjustmentOutcome(): SourcedValue<ROLL_OUTCOME> | undefined {
    return this.postRollOptions.replacedOutcome ?? this.preAdjustmentOutcome
  }

  get moveItem(): Promise<IronswornItem | undefined> | undefined {
    const { moveDfId, moveId } = this.preRollOptions
    if (moveDfId) return getFoundryMoveByDfId(moveDfId)
    if (moveId) return game.items?.get(moveId)
    return undefined
  }

  static fromJson(json: object): IronswornRoll {
    const ir = new IronswornRoll()
    Object.assign(ir, json)
    return ir
  }
}
