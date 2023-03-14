<template>
	<component
		:is="is"
		:data-tab-set="tabState.tabSetId"
		:class="{
			flexcol: tabState.orientation === 'vertical',
			flexrow: tabState.orientation === 'horizontal',
			[$style.wrapper]: true,
			[$style.horizontal]: tabState.orientation === 'horizontal',
			[$style.vertical]: tabState.orientation === 'vertical'
		}">
		<slot></slot>
	</component>
</template>

<script lang="ts" setup>
import { computed, inject } from 'vue'
import type { TabState} from './tab-helpers';
import { TabStateKey } from './tab-helpers'

/**
 * Container for {@link TabPanel} components. Should be descended from a {@link TabSet} component.
 */
withDefaults(defineProps<{ is?: any }>(), { is: 'div' })

const tabState = inject(TabStateKey) as TabState

const tabSetId = computed(() => tabState.tabSetId)
defineExpose({
	tabSetId: tabSetId.value
})
</script>

<style lang="scss" module>
.wrapper {
	// ensures that the TabPanels have a recent ancestor for their absolute positioning.
	position: relative;
}

.horizontal {
	// so the animation doesn't encroach on adjacent elements
	overflow-x: clip;
}

.vertical {
	// so the animation doesn't encroach on adjacent elements
	overflow-x: clip;
}
</style>
