<template>
	<RulesText
		class="rules-text-move"
		:source="data.system.Source"
		:content="data.system.Text"
		:strip-tables="hasOracles"
		type="markdown">
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
import { computed } from 'vue'
import RulesText from './rules-text.vue'

const props = defineProps<{
	data: ItemSource<'sfmove'>
	isProgressMove: boolean
}>()
const hasOracles = computed(() => (props.data.system.Oracles?.length ?? 0) > 0)
</script>

<style lang="scss" module>
.progressMoveLabel {
	opacity: 0.5;
}
</style>
