<template>
	<table class="oracle-table">
		<caption
			v-if="!noCaption && tableDescription"
			v-html="enrichMarkdown(tableDescription ?? '')" />
		<thead>
			<tr>
				<th scope="col" class="oracle-table-column-roll-range">
					{{ $t('IRONSWORN.OracleTable.ColumnLabel.Roll') }}
				</th>
				<th scope="col" class="oracle-table-column-result-text">
					{{ $t('IRONSWORN.OracleTable.ColumnLabel.Result') }}
				</th>
			</tr>
		</thead>
		<tbody>
			<tr v-for="(row, i) in tableRows" :key="`row${i}`">
				<td class="oracle-table-column-roll-range">{{ rangeString(row) }}</td>
				<td
					class="oracle-table-column-result-text"
					v-html="$enrichHtml(row.text)"></td>
			</tr>
		</tbody>
	</table>
</template>

<script setup lang="ts">
import { enrichMarkdown } from '../../vue-plugin.js'

type TableRowData = {
	low: number
	high: number
	text: string
	selected: boolean
}

// FIXME: use v10 types when available, or hack some together for tables
const props = defineProps<{
	tableRows: TableRowData[]
	tableDescription: string
	noCaption?: boolean
}>()

function rangeString({ low, high }: TableRowData) {
	if (low === high) {
		return low.toString()
	}
	return `${low}-${high}`
}
</script>

<style lang="scss" scoped>
caption,
th {
	text-align: left;
}

th,
td {
	&:first-child {
		padding-inline-start: var(--ironsworn-spacer-xs);
	}

	&:last-child {
		padding-inline-end: var(--ironsworn-spacer-xs);
	}
}
</style>
