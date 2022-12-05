<template>
  <component
    :is="is"
    ref="$el"
    role="tab"
    type="button"
    :class="$style.tab"
    :aria-disabled="disabled"
    :aria-selected="isActive"
    :aria-controls="`tabs--${tabState?._id}--panel--${index}`"
    :id="`tabs--${tabState?._id}--tab--${index}`"
    :tabindex="isActive ? undefined : -1"
    @click="setActiveTab(index)"
    @keydown="handleKeydown"
  >
    <slot></slot>
  </component>
</template>
<style lang="less" module>
.tab {
  border-radius: 0;
  border: 0;
  flex: 1 1 0;
  text-align: center;
  height: 100%;
  overflow-y: auto;
  padding: 5px;
  gap: 0.25em;
  justify-content: center;
  &:before {
    font-size: 140%;
  }
}
</style>

<script lang="ts" setup>
// TODO: figure out the nicest way to implement adding an icon.

import { computed, inject, ref, watch } from 'vue'
import {
  FocusActivePanel,
  FocusActivePanelKey,
  NextTabKey,
  PreviousTabKey,
  SetActiveTab,
  SetActiveTabKey,
  TabCountKey,
  TabIndexIncrementer,
  TabOrientationKey,
  TabStateKey,
} from './tab-helpers.js'

/**
 * The index tab of a {@link TabPanel}. Should be descended from a {@link TabList}.
 */
const props = withDefaults(
  defineProps<{
    /**
     * The tab's index must match the index of a {@link TabPanel}.
     */
    index: number
    disabled?: boolean
    is?: any
  }>(),
  { disabled: false, is: 'button' }
)

const tabState = inject(TabStateKey)
const tabOrientation = inject(TabOrientationKey)
const tabCount = inject(TabCountKey) as number
const setActiveTab = inject(SetActiveTabKey) as SetActiveTab
const focusActivePanel = inject(FocusActivePanelKey) as FocusActivePanel
const nextTab = inject(NextTabKey) as TabIndexIncrementer
const previousTab = inject(PreviousTabKey) as TabIndexIncrementer

const isActive = computed(() => tabState?.activeTab === props.index)
const isFocused = computed(() => tabState?.focusedTab === props.index)
const activeTab = computed(() => tabState?.activeTab as number)
const $el = ref<HTMLButtonElement>()

watch(isFocused, () => $el.value?.focus())

function handleKeydown(event: KeyboardEvent) {
  const vertical = tabOrientation === 'vertical'
  const horizontal = tabOrientation === 'horizontal'

  if (
    (horizontal && event.key === 'ArrowRight') ||
    (vertical && event.key === 'ArrowDown')
  ) {
    event.preventDefault()
    nextTab(activeTab.value)
  }
  if (
    (horizontal && event.key === 'ArrowLeft') ||
    (vertical && event.key === 'ArrowUp')
  ) {
    event.preventDefault()
    previousTab(activeTab.value)
  }
  // If in horizontal mode, focus the active panel on ArrowDown, for screenreaders
  if (horizontal && event.key === 'ArrowDown') {
    event.preventDefault()
    focusActivePanel()
  }

  if (event.key === 'Home') {
    event.preventDefault()
    setActiveTab(0)
  }
  if (event.key === 'End') {
    event.preventDefault()
    setActiveTab(tabCount - 1)
  }
}
</script>
