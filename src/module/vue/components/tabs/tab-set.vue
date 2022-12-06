<template>
  <div
    :class="{
      flexcol: orientation === 'horizontal',
      flexrow: orientation === 'vertical',
    }"
  >
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
import { provide, reactive } from 'vue'
import {
  FocusActivePanelKey,
  Orientation,
  SetActivePanelRefKey,
  SetActiveTabKey,
  TabActivationMode,
  TabKey,
  TabState,
  TabStateKey,
} from './tab-helpers.js'

/**
 * The wrapper for tabbed displays, which controls tab focus and selection. Put a {@link TabList} (filled with {@link Tab}s) and a {@link TabPanels} (filled with {@link TabPanel}s) in it.
 */
const props = withDefaults(
  defineProps<{
    id: string
    tabKeys: TabKey[]
    /**
     * @default ```$props.tabKeys[0]```
     */
    defaultKey?: TabKey
    /**
     * @default ```'horizontal'```
     */
    orientation?: Orientation
    /**
     * @default ```'auto'```
     */
    tabActivationMode?: TabActivationMode
  }>(),
  {
    orientation: 'horizontal',
    tabActivationMode: 'auto',
  }
)

const tabState = reactive<TabState>({
  activeTab: props.defaultKey ?? props.tabKeys[0],
  activePanelRef: null,
  focusedTab: null,
  orientation: props.orientation,
  mode: props.tabActivationMode,
  tabKeys: props.tabKeys,
  tabSetId: props.id,
})

function setActivePanelRef(ref: HTMLElement) {
  tabState.activePanelRef = ref
}
function focusActivePanel() {
  if (tabState.activePanelRef) {
    tabState.activePanelRef.focus()
  }
}
type ItemIn<T extends any[]> = T extends (infer U)[] ? U : never

function setActiveTab<T extends ItemIn<typeof props.tabKeys>>(tabKey: T) {
  if (tabState.activeTab !== tabKey) {
    tabState.activeTab = tabKey
  }
}

provide(TabStateKey, tabState)
provide(SetActiveTabKey, setActiveTab)
provide(SetActivePanelRefKey, setActivePanelRef)
provide(FocusActivePanelKey, focusActivePanel)

defineExpose({
  setActiveTab,
})
</script>
