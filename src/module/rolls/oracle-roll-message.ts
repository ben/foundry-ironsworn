import { compact, pick, sortBy } from 'lodash'
import { marked } from 'marked'
import { getFoundryTableByDfId } from '../dataforged'
import {
  createIronswornOracleTree,
  createStarforgedOracleTree,
  findPathToNodeByDfId,
  findPathToNodeByTableId,
} from '../features/customoracles'

export interface TableRow {
  low: number
  high: number
  text: string
  selected: boolean
}

function maybeShowDice(roll: Roll) {
  const dice3d = (game as any).dice3d
  if (!dice3d) return
  dice3d.showForRoll(roll, game.user, true)
}

/**
 * This class is used to create or update a chat message that represents the
 * result of a random draw. The chat message includes a "reroll" button, so
 * the message carries the data necessary to reconstruct how the roll was
 * initiated so it can be performed again.
 */
export class OracleRollMessage {
  // A valid object has either `dfOracleId`, `tableId`, or `tableRows`
  protected dfOracleId?: string
  protected tableId?: string
  protected tablePack?: string // valid if tableId is set
  protected tableRows?: TableRow[]

  // Display properties
  protected title?: string
  protected subtitle?: string

  // Only if this has already been created as a chat message
  protected chatMessageId?: string

  /**
   *
   * @param opts Exactly one of `dfOracleId`, `tableId`, or `tableRows` is required. If `tableId` is provided, `tablePack` may also be provided.
   */
  constructor(opts: {
    dfOracleId?: string
    tableId?: string
    tablePack?: string
    tableRows?: TableRow[]
    title?: string
    subtitle?: string
  }) {
    if (compact([opts.dfOracleId, opts.tableId, opts.tableRows]).length !== 1) {
      throw new Error(
        'Exactly one of `dfOracleId`, `tableId`, or `tableRows` is required.'
      )
    }

    Object.assign(this, opts)
  }

  // The resolved roll for the result
  protected roll?: Roll

  static async fromDfOracleId(dfOracleId: string): Promise<OracleRollMessage> {
    // Subtitle can be inferred from the structure of the DF ID
    const oracleTreeRoot = await (dfOracleId.startsWith('Ironsworn/')
      ? createIronswornOracleTree
      : createStarforgedOracleTree)()
    const pathElements = findPathToNodeByDfId(oracleTreeRoot, dfOracleId)
    const pathNames = pathElements.map((x) => x.displayName)
    pathNames.shift() // root node has no display name
    pathNames.pop() // this is the one we rolled, it gets the main title

    return new OracleRollMessage({
      dfOracleId,
      subtitle: pathNames.join(' / '),
    })
  }

  static async fromTableId(
    tableId: string,
    tablePack?: string
  ): Promise<OracleRollMessage> {
    return new OracleRollMessage({ tableId, tablePack })
  }

  static async fromRows(
    tableRows: TableRow[],
    title: string,
    subtitle?: string
  ) {
    return new OracleRollMessage({ tableRows, title, subtitle })
  }

  private async getRollTable(): Promise<RollTable | undefined> {
    if (this.tableRows) return undefined

    if (this.dfOracleId) {
      return getFoundryTableByDfId(this.dfOracleId)
    }

    if (this.tablePack) {
      const pack = game.packs.get(this.tablePack)
      const packTable = pack?.get(this.tableId ?? '') as RollTable
      if (packTable) return packTable
    }

    return game.tables?.get(this.tableId ?? '')
  }

  /**
   * @returns Rows in the table in a format suitable for display, sorted by `low`
   */
  private async getTableRows(): Promise<TableRow[]> {
    let localRows = this.tableRows
    if (!localRows) {
      const table = await this.getRollTable()
      if (table) {
        localRows = table.data.results.contents.map((x) => ({
          low: x.data.range[0],
          high: x.data.range[1],
          text: marked.parseInline(x.data.text),
          selected: false,
        }))
      } else {
        localRows = []
      }
    }

    return sortBy(localRows, 'low')
  }

  /**
   * Roll for a result, only if not already rolled
   */
  async ensureRolled() {
    if (!this.roll) await this.forceRoll()
  }

  /**
   * Always roll or reroll for a result, even if already rolled
   */
  async forceRoll() {
    const rows = await this.getTableRows()

    const highestValue = rows[rows.length - 1].high
    this.roll = new Roll(`1d${highestValue}`)
    await this.roll.evaluate({ async: true })
  }

  async getResult(): Promise<TableRow | undefined> {
    await this.ensureRolled()

    const rows = await this.getTableRows()
    return rows.find(
      (x) =>
        x.low <= (this.roll?.total ?? 0) && (this.roll?.total ?? 0) <= x.high
    )
  }

  private async oraclePath(): Promise<string | undefined> {
    if (!this.tableId) return undefined

    const starforgedRoot = await createStarforgedOracleTree()
    const ironswornRooot = await createIronswornOracleTree()
    const pathElements =
      findPathToNodeByTableId(starforgedRoot, this.tableId) ??
      findPathToNodeByTableId(ironswornRooot, this.tableId)
    pathElements.shift() // no display name for root node
    pathElements.pop() // last node is the table we rolled
    return pathElements.map((x) => x.displayName).join(' / ')
  }

  async createOrUpdate() {
    await this.ensureRolled()

    const rows = await this.getTableRows()
    const resultRow = rows.find(
      (x) =>
        x.low <= (this.roll?.total ?? 0) && (this.roll?.total ?? 0) <= x.high
    )
    if (!resultRow) return

    const resultIdx = rows.indexOf(resultRow)
    const displayRows: TableRow[] = compact([
      rows[resultIdx - 1],
      { ...resultRow, selected: true },
      rows[resultIdx + 1],
    ])

    const table = await this.getRollTable()
    const renderData = {
      title: this.title ?? table?.name,
      subtitle: this.subtitle ?? (await this.oraclePath()),
      displayRows,
      oracleRoll: this,
    }
    const content = await renderTemplate(
      'systems/foundry-ironsworn/templates/rolls/oracle-roll-message.hbs',
      renderData
    )

    if (this.chatMessageId) {
      maybeShowDice(this.roll!)
      const msg = game.messages?.get(this.chatMessageId)
      return msg?.update({ content })
    } else {
      const speaker = ChatMessage.getSpeaker()
      const messageData = {
        speaker,
        content,
        type: CONST.CHAT_MESSAGE_TYPES.ROLL,
        roll: this.roll,
      }

      const cls = CONFIG.ChatMessage.documentClass
      const msg = await cls.create(messageData as any, {})
      this.chatMessageId = msg?.id
      return msg
    }
  }

  toJSON(): any {
    return pick(this, [
      'dfOracleId',
      'tableId',
      'tablePack',
      'tableRows',
      'title',
      'subtitle',
    ])
  }

  static async fromMessage(
    messageId: string
  ): Promise<OracleRollMessage | undefined> {
    const msg = game.messages?.get(messageId)
    const html = await msg?.getHTML()

    // Reconstitute roll
    const json = html?.find('.oracle-roll').data('oracleroll')
    if (!json) return undefined

    const orm = new OracleRollMessage(json)
    orm.roll = msg?.roll || undefined
    orm.chatMessageId = messageId
    return orm
  }
}
