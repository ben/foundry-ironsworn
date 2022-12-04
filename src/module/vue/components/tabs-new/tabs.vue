<template>
  <div :class="$style.tabs">
    <slot></slot>
  </div>
</template>

<style lang="less" module>
.tabs {
}
</style>

<script lang="ts" setup>
import { clamp } from 'lodash'
import { provide, reactive, useSlots } from 'vue'
import {
  FocusActivePanelKey,
  NextTabKey,
  Orientation,
  PreviousTabKey,
  SetActivePanelRefKey,
  SetActiveTabKey,
  TabActivationMode,
  TabActivationModeKey,
  TabOrientationKey,
  TabState,
  TabStateKey,
} from './tab-helpers.js'

const $slots = useSlots()

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
function focusTab(tabIndex: number) {
  tabState.focusedTab = tabIndex
}
function setActiveTab(tabIndex: number) {
  tabState.activeTab = tabIndex
}
function nextTab(tabCount: number) {
  const maxTabIndex = tabCount - 1
  tabState.activeTab = clamp(tabState.activeTab + 1, 0, maxTabIndex)
}
function previousTab(tabCount: number) {
  const maxTabIndex = tabCount - 1
  tabState.activeTab = clamp(tabState.activeTab - 1, 0, maxTabIndex)
}

provide(TabStateKey, tabState)
provide(SetActiveTabKey, setActiveTab)
provide(SetActivePanelRefKey, setActivePanelRef)
provide(FocusActivePanelKey, focusActivePanel)
provide(TabOrientationKey, props.orientation)
provide(TabActivationModeKey, props.tabActivationMode)
provide(NextTabKey, nextTab)
provide(PreviousTabKey, previousTab)
</script>
