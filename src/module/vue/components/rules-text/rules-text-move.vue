<template>
	<RulesText
		class="rules-text-move"
		:source="ds?._source"
		:content="data.system.Text"
		:strip-tables="hasOracles"
		type="markdown"
	>
		<template #before-main>
			<slot name="before-main">
				<i v-if="isProgressMove" :class="$style.progressMoveLabel">{{
					$t('IRONSWORN.ProgressMove')
				}}</i>
			</slot>
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
import type { Move } from '@datasworn/core/dist/Datasworn'
import { computed } from 'vue'
import RulesText from './rules-text.vue'
import { IdParser } from '../../../datasworn2'

const props = defineProps<{
	data: ItemSource<'sfmove'>
	isProgressMove: boolean
}>()
const hasOracles = computed(
	() => (props.data.system.dsOracleIds?.length ?? 0) > 0
)

const dsid = props.data.flags['foundry-ironsworn']?.dsid
const ds: Move | undefined = IdParser.get(dsid)
</script>

<style lang="scss" module>
.progressMoveLabel {
	opacity: 0.5;
}
</style>
