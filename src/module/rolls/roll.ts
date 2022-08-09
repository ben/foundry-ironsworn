// TODO:
// - Convert to HTML for chat messages
// - Rehydrate from chat message (will be needed for rerolls)
// - Options input covers all cases
// - Rolling that plays nicer with DF Manual Rolls (all in one go, not {d6+N,d10,d10})
// - Rerolls update chat message

export enum ROLL_OUTCOME {
  MISS = 'MISS',
  WEAK = 'WEAK',
  STRONG = 'STRONG',
}

// Input to rolling and resolution
export interface PreRollOptions {
  progressValue?: number // indicates this is a progress roll, no action die will be rolled

  automaticOutcome?: {
    source: string
    outcome: ROLL_OUTCOME
  }
  // As in Armored #1
  presetActionDie?: {
    source: string
    value: number
  }
  // As in Sleuth #1
  extraChallengeDice?: {
    source: string
    value: number
  }
}

// Input to rendering, can be updated after the fact
export interface PostRollOptions {
  // As in Kinetic #2
  suggestedAdds?: {
    // if present and non-empty, will suggest in the chat-card UI
    source: string
    add: number
  }[]
  adds?: number

  // As in Loyalist #3
  replacedChallenge1?: number
  replacedChallenge2?: number

  // As in Brawler #2 or Take Decisive Action
  allowReplacingOutcome?: boolean
  replacedOutcome?: ROLL_OUTCOME
}

export class IronswornRoll {
  rawActionDie?: number
  rawChallenge1?: number
  rawChallenge2?: number
  rawChallenge3?: number
  preRollOptions: PreRollOptions = {}
  postRollOptions: PostRollOptions = {}
  chatMessageId?: string

  roll() {
    // TODO: perform the roll and render to chat
  }

  toMessage() {
    // TODO: render to HTML and create/update chat message
    // TODO: include JSON.stringify(this) as data-ironswornroll
  }

  static async fromMessage(
    messageId: string
  ): Promise<IronswornRoll | undefined> {
    const msg = game.messages?.get(messageId)
    const html = await msg?.getHTML()
    const json = html?.data('ironswornroll')
    if (!json) return undefined

    const ir = new IronswornRoll()
    Object.assign(ir, JSON.parse(json))
    return ir
  }
}
