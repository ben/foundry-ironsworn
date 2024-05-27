<template>
	<h1 @click="toggle">
		{{ move.name }} <code>({{ move.dfid ?? '(custom)' }})</code>
	</h1>
	<CollapseTransition>
		<Suspense v-if="expanded">
			<template #default>
				<SfIndexedMoveContents :move="move" />
			</template>
		</Suspense>
	</CollapseTransition>
</template>

<script setup lang="ts">
import { ref, Suspense } from 'vue'
import type { IndexedMove } from '../../features/custommoves'
import { IronswornItem } from '../../item/item'

import Collapsible from './collapsible/collapsible.vue'
import SfIndexedMoveContents from './sf-indexed-move-contents.vue'
import CollapseTransition from './transition/collapse-transition.vue'

const props = withDefaults(
	defineProps<{
		move: IndexedMove
		headingLevel?: number
		toggleSectionClass?: any
		toggleButtonClass?: any
		/**
		 * Props to be passed to the Collapsible component.
		 */
		collapsible?: Omit<
			PropsOf<typeof Collapsible>,
			| 'contentWrapperClass'
			| 'toggleWrapperIs'
			| 'toggleSectionClass'
			| 'noIcon'
			| 'toggleButtonClass'
			| 'toggleTooltip'
			| 'toggleWrapperClass'
			| 'toggleLabel'
		>
	}>(),
	{
		headingLevel: 4,
		toggleSectionClass: '',
		toggleButtonClass: '',
		oracleDisabled: null
	}
)

const expanded = ref(false)

function toggle() {
	expanded.value = !expanded.value
}
</script>
