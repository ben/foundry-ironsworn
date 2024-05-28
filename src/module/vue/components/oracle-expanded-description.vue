<template>
	<div>
		<h4 v-if="unifiedDescription" v-html="unifiedDescription" />
		<RulesTextOracle
			v-for="table in tables"
			:key="table.id"
			:class="$style.content"
			:title="tables.length > 1 ? table.title : undefined"
			:table-rows="table.rows"
			:table-description="table.description"
			:source="node.dataforgedNode?.Source"
			@moveclick="moveclick"
			@oracleclick="oracleclick"
		/>
	</div>
</template>

<script setup lang="ts">
import { IOracleTreeNode } from '../../features/customoracles'
import { IronswornItem } from '../../item/item'
import type { OracleTable } from '../../roll-table/oracle-table'
import { enrichHtml } from '../vue-plugin'
import RulesTextOracle from './rules-text/rules-text-oracle.vue'

const props = defineProps<{ node: IOracleTreeNode }>()

const tables = await Promise.all(
	props.node.tables.map(async (tableUuid) => {
		const tableData = (await fromUuid(tableUuid)) as OracleTable
		return {
			id: tableUuid,
			title: tableData.name ?? '',
			rows: tableData.results.map((row: any) => ({
				low: row.range[0],
				high: row.range[1],
				text: row.text,
				selected: false
			})),
			description: tableData.description
		}
	})
)

let unifiedDescription: string | undefined
if (tables.every((t) => t.description === tables[0].description)) {
	unifiedDescription = await enrichHtml(tables[0].description)
	for (const t of tables) {
		t.description = ''
	}
}

// Click on a move link: broadcast event
function moveclick(item: IronswornItem) {
	CONFIG.IRONSWORN.emitter.emit('highlightMove', item.uuid)
}

function oracleclick(dfid) {
	CONFIG.IRONSWORN.emitter.emit('highlightOracle', dfid)
}

const spacerSize = '18px'
</script>

<style lang="scss" module>
.content {
	margin: var(--ironsworn-spacer-sm);
}

.indent {
	margin-left: v-bind(spacerSize);
}
</style>
