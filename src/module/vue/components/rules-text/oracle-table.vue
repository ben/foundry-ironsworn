<template>
	<table class="oracle-table">
		<caption
			v-if="!noCaption && rollTable?.description"
			v-html="enrichMarkdown(rollTable?.description ?? '')" />
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
import { computed } from 'vue'
import { sortBy } from 'lodash-es'
import { enrichMarkdown } from '../../vue-plugin.js'

// FIXME: use v10 types when available, or hack some together for tables
const props = defineProps<{
	oracleTableUuid: string
	noCaption?: boolean
}>()

const rollTable = (await fromUuid(props.oracleTableUuid)) as
	| (RollTable & { description?: string })
	| undefined

type TableRowData = {
	low: number
	high: number
	text: string
	selected: boolean
}

function rangeString({ low, high }: TableRowData) {
	if (low === high) {
		return low.toString()
	}
	return `${low}-${high}`
}
const tableRows = computed(() =>
	sortBy(
		(rollTable?.results?.contents ?? []).map(
			(row: any) =>
				({
					low: row.range[0],
					high: row.range[1],
					text: row.text,
					selected: false
				} as TableRowData)
		),
		'low'
	)
)
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
