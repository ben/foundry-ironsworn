// TODO:
// - Convert to HTML for chat messages
// - Rehydrate from chat message (will be needed for rerolls)
// - Options input covers all cases
// - Rolling that plays nicer with DF Manual Rolls (all in one go, not {d6+N,d10,d10})
// - Rerolls update chat message

import { pick, range } from 'lodash'
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

  automaticOutcome?: SourcedValue<ROLL_OUTCOME>
  // As in Armored #1
  presetActionDie?: SourcedValue
  // As in Sleuth #1
  extraChallengeDice?: SourcedValue

  // Decided before the roll, but kept around for resolving updates later
  moveId?: string // For custom moves
  moveDfId?: string // for "official" moves
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
  preRollOptions: PreRollOptions = {}
  postRollOptions: PostRollOptions = {}

  roll?: Roll
  chatMessageId?: string

  static action(stat: string, value: number, adds?: number): IronswornRoll {
    const r = new IronswornRoll()
    r.preRollOptions = {
      action: {
        stat: {
          source: stat,
          value,
        },
        adds,
      },
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

  async createOrUpdateChatMessage() {
    return IronswornRollChatMessage.createOrUpdate(this)
  }

  serialize() {
    return pick(this, [
      'preRollOptions',
      'postRollOptions',
      'rawActionValue',
      'rawChallengeValues',
    ])
  }

  static fromJson(json: object): IronswornRoll {
    const ir = new IronswornRoll()
    Object.assign(ir, json)
    return ir
  }
}
