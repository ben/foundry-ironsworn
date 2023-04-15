import type { TableResultDataConstructorData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/tableResultData'
import type { LegacyTableRow } from '../item/itemtypes'
import type { TableRow } from '../rolls'

/**
 *
 * @param document The parent document.
 * @param key The dot-notation key to convert to TableResults
 * @param type A value for the `foundry-ironsworn.type` flag, used to differentiate the table row for later migration.
 * @returns
 */
export function normalizeTableRows(
	document: any,
	key: string,
	type: string
): TableResultDataConstructorData[] {
	const oldRows = getProperty(document, key) as Array<TableRow | LegacyTableRow>
	if (!Array.isArray(oldRows)) {
		console.log(
			`Unable to migrate because this document lacks a "${key}" key `,
			document
		)
	}
	const flags = {
		'foundry-ironsworn': {
			type,
			sourceId: document.id
		}
	}
	return oldRows.map((row) => {
		if ((row as any).range) {
			// If the row is somehow already converted, just update the flags.
			return { row, flags } as any
		}
		return toTableResult(row, flags)
	})
}

export function toTableResult(
	tableRow: TableRow | LegacyTableRow,
	flags?: Record<string, unknown>
): TableResultDataConstructorData {
	const text =
		(tableRow as LegacyTableRow).description ?? (tableRow as TableRow).text
	return {
		range: (tableRow as any).range ?? [tableRow.low, tableRow.high],
		text,
		flags
	} as TableResultDataConstructorData
}
