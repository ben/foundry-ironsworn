import { TableResultDataConstructorData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/tableResultData'
import { LegacyFeatureOrDanger } from '../item/itemtypes'
import { TableRow } from '../rolls'

export function normalizeTableRows(document: any, key: string, type: string) {
  const oldRows = getProperty(document, key) as Array<
    TableRow | LegacyFeatureOrDanger
  >
  if (!Array.isArray(oldRows)) {
    console.log(
      `Unable to migrate because this document lacks a "${key}" key `,
      document
    )
  }
  const flags = {
    'foundry-ironsworn': {
      type,
      sourceId: document.id,
    },
  }
  return oldRows.map((row) => {
    if ((row as any).range) {
      // If the row is somehow already converted, just merge the flags.
      return mergeObject(row, { flags })
    }
    return toTableResult(row, flags)
  })
}

export function toTableResult(
  tableRow: TableRow | LegacyFeatureOrDanger,
  flags?: Record<string, unknown>
): TableResultDataConstructorData {
  const text =
    (tableRow as LegacyFeatureOrDanger).description ??
    (tableRow as TableRow).text
  return {
    range: [tableRow.low, tableRow.high],
    text,
    flags,
  } as TableResultDataConstructorData
}
