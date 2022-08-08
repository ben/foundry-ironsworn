// TODO:
// - Convert to HTML for chat messages
// - Rehydrate from chat message (will be needed for rerolls)
// - Options input covers all cases
// - Rolling that plays nicer with DF Manual Rolls (all in one go, not {d6+N,d10,d10})
// - Rerolls update chat message

export enum HIT_TYPE {
  MISS = 'MISS',
  WEAK = 'WEAK',
  STRONG = 'STRONG',
}

export interface PreRollOptions {
  automaticOutcome?: HIT_TYPE
  presetActionDie?: number // As in Armored #1
  threeChallengeDice?: boolean // As in Sleuth #1
}

export interface PostRollOptions {
  actionBonus?: number // As in Kinetic #2
  replacedChallenge1?: number // As in Loyalist #3
  replacedChallenge2?: number
  replacedOutcome?: HIT_TYPE // As in Brawler #2 or Take Decisive Action
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
