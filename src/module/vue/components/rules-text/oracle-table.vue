<template>
	<table class="oracle-table">
		<caption
			v-if="!noCaption && tableDescription"
			v-html="renderedDescription"
		/>
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
					v-html="renderedRowTexts[i]"
				></td>
			</tr>
		</tbody>
	</table>
</template>

<script setup lang="ts">
import type { LegacyTableRow } from '../../../roll-table/roll-table-types'
import { enrichHtml, enrichMarkdown } from '../../vue-plugin.js'

const props = defineProps<{
	tableRows: LegacyTableRow[]
	tableDescription: string
	noCaption?: boolean
}>()

const renderedDescription = await enrichMarkdown(props.tableDescription ?? '')
const renderedRowTexts = await Promise.all(
	props.tableRows.map((row) => enrichHtml(row.text))
)

function rangeString({ low, high }: LegacyTableRow) {
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
