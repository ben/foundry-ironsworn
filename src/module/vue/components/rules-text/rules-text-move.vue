<template>
	<RulesText
		class="rules-text-move"
		:source="move.dataforgedMove?.Source"
		:content="content"
		:strip-tables="hasOracles"
		type="markdown">
		<template #before-main>
			<slot name="before-main">
				<i
					v-if="move.moveItem().isProgressMove()"
					:class="$style.progressMoveLabel"
					>{{ $t('IRONSWORN.ProgressMove') }}</i
				>
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
import type { Move } from '../../../features/custommoves.js'

import RulesText from './rules-text.vue'

const props = defineProps<{ move: Move }>()
const content = computed(() => {
	const moveItem = props.move.moveItem()
	return moveItem.system.Text
})

const hasOracles = computed(
	() => (props.move?.dataforgedMove?.Oracles?.length ?? 0) > 0
)
</script>

<style lang="scss" module>
.progressMoveLabel {
	opacity: 0.5;
}
</style>
