<template>
	<RulesText class="rules-text-oracle" :source="source" type="slot">
		<template #default>
			<OracleTable :oracle-table-uuid="oracleTableUuid" />
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

<script setup lang="ts">
import RulesText from './rules-text.vue'
import OracleTable from './oracle-table.vue'
import type { ISource } from 'dataforged'

const props = defineProps<{
	oracleTableUuid: string
	source?: ISource
}>()
</script>
