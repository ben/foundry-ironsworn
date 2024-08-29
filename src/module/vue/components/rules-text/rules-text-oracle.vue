<template>
	<RulesText class="rules-text-oracle" :source="source" type="slot">
		<template #default>
			<h4>{{ props.title }}</h4>
			<OracleTable
				:table-description="tableDescription"
				:table-rows="tableRows"
			/>
		</template>
		<template #before-main>
			<slot name="before-main"></slot>
		</template>
		<template #after-main>
			<slot name="after-main"></slot>
		</template>
		<template #after-footer>
			<slot name="after-footer"></slot>
		</template>
	</RulesText>
</template>

<style lang="less" scoped>
h4 {
	text-transform: uppercase;
	margin-top: 0.5rem;
	font-weight: bold;
}
</style>

<script setup lang="ts">
import RulesText from './rules-text.vue'
import OracleTable from './oracle-table.vue'
import type { SourceInfo } from '@datasworn/core/dist/Datasworn'
import type { LegacyTableRow } from '../../../roll-table/roll-table-types'

const props = defineProps<{
	title?: string
	tableRows: LegacyTableRow[]
	tableDescription: string
	source?: SourceInfo
}>()
</script>
