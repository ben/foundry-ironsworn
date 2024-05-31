import type { TableResultDataConstructorData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/tableResultData'
import type { LegacyTableRow } from '../roll-table/roll-table-types'

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
	const oldRows = foundry.utils.getProperty(document, key) as LegacyTableRow[]
	if (!Array.isArray(oldRows)) {
		console.log(
			`Unable to migrate because this document lacks a "${key}" key `,
			document
		)
	}
	const flags = {
		'foundry-ironsworn': {
			type,
			sourceId: document.uuid
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
	tableRow: LegacyTableRow,
	flags?: Record<string, unknown>
): TableResultDataConstructorData {
	const text = tableRow.description ?? tableRow.text
	return {
		// @ts-expect-error
		range: tableRow.range ?? [tableRow.low, tableRow.high],
		text,
		flags
	} as TableResultDataConstructorData
}
