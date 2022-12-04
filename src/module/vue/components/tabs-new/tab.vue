<template>
  <button
    ref="$el"
    role="tab"
    type="button"
    :aria-disabled="disabled"
    :aria-selected="isActive"
    :aria-controls="`tabs--${tabState?._id}--panel--${index}`"
    :id="`tabs--${tabState?._id}--tab--${index}`"
    :tabindex="isActive ? undefined : -1"
    @click="setActiveTab(index)"
    @keydown="handleKeydown"
  >
    <slot></slot>
  </button>
</template>

<script lang="ts" setup>
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

const tabState = inject(TabStateKey)
const tabOrientation = inject(TabOrientationKey)
const tabCount = inject(TabCountKey) as number
const setActiveTab = inject(SetActiveTabKey) as SetActiveTab
const focusActivePanel = inject(FocusActivePanelKey) as FocusActivePanel
const nextTab = inject(NextTabKey) as TabIndexIncrementer
const previousTab = inject(PreviousTabKey) as TabIndexIncrementer

const props = withDefaults(
  defineProps<{
    index: number
    disabled?: boolean
  }>(),
  { disabled: false }
)

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
