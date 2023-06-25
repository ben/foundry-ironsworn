<template>
	<IronBtn
		:id="getTabId(tabState.tabSetId, tabKey)"
		ref="$el"
		role="tab"
		:data-tab-set="tabState.tabSetId"
		:data-tab-key="tabKey"
		:class="{ [$style.tab]: true, [$style[tabState.orientation]]: true }"
		:aria-selected="isActive"
		:aria-controls="getTabPanelId(tabState.tabSetId, tabKey)"
		:tabindex="isActive ? undefined : -1"
		:block="block"
		v-bind="(buttonProps, $attrs)"
		@click="setActiveTab(tabKey)"
		@keydown="handleKeydown">
		<template v-for="(_, slot) of $slots" #[slot]="scope">
			<slot :name="slot" v-bind="scope" />
		</template>
	</IronBtn>
</template>
<script lang="ts" setup>
import { omit } from 'lodash-es'
import { computed, inject, ref } from 'vue'
import IronBtn from '../buttons/iron-btn.vue'
import type {
	FocusActivePanel,
	SetActiveTab,
	TabKey,
	TabState
} from './tab-helpers.js'
import {
	FocusActivePanelKey,
	getTabId,
	getTabPanelId,
	SetActiveTabKey,
	TabStateKey
} from './tab-helpers.js'

interface Props extends PropsOf<typeof IronBtn> {
	/**
	 * The tab's key must match the key of a {@link TabPanel}.
	 */
	tabKey: TabKey
	nogrow?: boolean
	disabled?: boolean
	block?: boolean
}

/**
 * The index tab of a {@link TabPanel}, which serves as its title/label. Should be descended from a {@link TabList}.
 * @extends {@link IronBtn}
 */
const props = withDefaults(defineProps<Props>(), {
	block: true
})

const buttonProps = computed(() => omit(props, 'tabKey'))

const tabState = inject(TabStateKey) as TabState

const setActiveTab = inject(SetActiveTabKey) as SetActiveTab<
	typeof props.tabKey
>
const focusActivePanel = inject(FocusActivePanelKey) as FocusActivePanel

let $el = ref<typeof IronBtn>()

const isActive = computed(() => tabState.activeTab === props.tabKey)

const tabSetId = computed(() => tabState.tabSetId)
defineExpose({
	tabSetId: tabSetId.value
})

function handleKeydown(event: KeyboardEvent) {
	const vertical = tabState.orientation === 'vertical'
	const horizontal = tabState.orientation === 'horizontal'
	const currentTabIndex = tabState.tabKeys.indexOf(props.tabKey)
	const lastTabIndex = tabState.tabKeys.length - 1
	switch (true) {
		case horizontal && event.key === 'ArrowRight':
		case vertical && event.key === 'ArrowDown':
			{
				event.preventDefault()
				const nextTabIndex = Math.min(currentTabIndex + 1, lastTabIndex)
				const nextTabKey = tabState.tabKeys[nextTabIndex]
				setActiveTab(nextTabKey)
			}
			break
		case horizontal && event.key === 'ArrowLeft':
		case vertical && event.key === 'ArrowUp':
			{
				event.preventDefault()
				const previousTabIndex = Math.max(currentTabIndex - 1, 0)
				const previousTabKey = tabState.tabKeys[previousTabIndex]
				setActiveTab(previousTabKey)
			}
			break
		// If in horizontal mode, focus the active panel on ArrowDown, for screenreaders
		case horizontal && event.key === 'ArrowDown':
			event.preventDefault()
			focusActivePanel()
			break
		case event.key === 'Home':
			event.preventDefault()
			setActiveTab(tabState.tabKeys[0])
			break
		case event.key === 'End':
			event.preventDefault()
			setActiveTab(tabState.tabKeys[lastTabIndex])
			break
		default:
			break
	}
}
</script>

<style lang="scss" module>
.tab {
	flex: 1 1 0;
	gap: var(--ironsworn-spacer-sm);
	margin: 0;
	border: 0;
	border-radius: 0;
	padding: var(--ironsworn-spacer-md);
	overflow-x: visible;
}

.vertical {
	// TODO
}

.horizontal {
	line-height: var(--ironsworn-line-height-lg);
}
</style>
