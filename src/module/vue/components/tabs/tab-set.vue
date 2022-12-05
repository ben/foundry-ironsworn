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
  TabState,
  TabStateKey,
} from './tab-helpers.js'

/**
 * The wrapper for tabbed displays, which controls tab focus and selection. Put a {@link TabList} (filled with {@link Tab}s) and a {@link TabPanels} (filled with {@link TabPanel}s) in it.
 */
const props = withDefaults(
  defineProps<{
    id: string
    defaultIndex?: number
    orientation?: Orientation
    tabActivationMode?: TabActivationMode
  }>(),
  {
    defaultIndex: 0,
    orientation: 'horizontal',
    tabActivationMode: 'auto',
  }
)

const tabState = reactive<TabState>({
  activeTab: props.defaultIndex,
  activePanelRef: null,
  focusedTab: null,
  orientation: props.orientation,
  mode: props.tabActivationMode,
  _id: props.id,
})

function setActivePanelRef(ref: HTMLElement) {
  tabState.activePanelRef = ref
}
function focusActivePanel() {
  if (tabState.activePanelRef) {
    tabState.activePanelRef.focus()
  }
}

// FIXME: this doesn't appear referenced, what did i miss?
function setActiveTab(tabIndex: number) {
  tabState.activeTab = tabIndex
}

provide(TabStateKey, tabState)
provide(SetActiveTabKey, setActiveTab)
provide(SetActivePanelRefKey, setActivePanelRef)
provide(FocusActivePanelKey, focusActivePanel)

defineExpose({
  setActiveTab,
})
</script>
