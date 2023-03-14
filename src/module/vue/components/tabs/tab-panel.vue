<template>
	<Transition :name="transitionName">
		<component
			:is="is"
			v-show="isActive"
			:id="getTabPanelId(tabState.tabSetId, tabKey)"
			ref="$el"
			role="tabpanel"
			:aria-labelledby="getTabId(tabState.tabSetId, tabKey)"
			tabindex="-1"
			:data-tab-set="tabState.tabSetId"
			:data-tab-key="tabKey"
			:class="$style.tabPanel">
			<slot></slot>
		</component>
	</Transition>
</template>

<script lang="ts" setup>
import type { Ref } from 'vue'
import { computed, inject, ref, watch } from 'vue'
import type { SetActivePanelRef, TabKey, TabState } from './tab-helpers.js'
import {
	getSlideTransitionName,
	getTabId,
	getTabPanelId,
	SetActivePanelRefKey,
	TabStateKey
} from './tab-helpers.js'

/**
 * The container for the content associated with a {@link Tab}. Should be descended from a {@link TabPanels} component.
 */
const props = withDefaults(
	defineProps<{
		/**
		 * The key must match that of a {@link Tab} with the same parent {@link TabSet} element.
		 */
		tabKey: TabKey
		/**
		 * @defaultValue 'div'
		 */
		is?: any
	}>(),
	{ is: 'div' }
)

const tabState = inject(TabStateKey) as TabState

const $el = ref<HTMLElement>() as Ref<HTMLElement>
const isActive = computed(() => tabState.activeTab === props.tabKey)
const setActivePanelRef = inject(SetActivePanelRefKey) as SetActivePanelRef

watch(isActive, () => isActive.value && setActivePanelRef($el.value))

const tabSetId = computed(() => tabState.tabSetId)
defineExpose({ tabSetId: tabSetId.value })

/**
 * Extracts the `--ironsworn-tab-transition` CSS variable to set the tab panel transition. If the variable is set to 'slide', it computes an appropriate direction for the slide.
 */
const transitionName = computed(() => {
	const varHaver =
		document.querySelector<HTMLElement>('.system-foundry-ironsworn') ??
		document.documentElement
	const themeTransition = getComputedStyle(varHaver)
		.getPropertyValue('--ironsworn-tab-transition')
		.trim()
	if (themeTransition === 'slide') {
		const thisIndex = tabState.tabKeys.indexOf(props.tabKey)
		const oldIndex = tabState.tabKeys.indexOf(tabState.previousTab)
		const newIndex = tabState.tabKeys.indexOf(tabState.activeTab)
		const slideTransitionName = getSlideTransitionName(
			thisIndex,
			oldIndex,
			newIndex,
			tabState.orientation
		)
		return slideTransitionName
	}
	return themeTransition
})
</script>

<style lang="less" scoped>
[class*='-leave-active'] {
	// prevents outgoing panels from fighting incoming panels for space
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
}
</style>

<style lang="less" module>
.tabPanel {
	backface-visibility: hidden;
	background-color: var(--ironsworn-color-bg);
}
</style>
