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
@import (reference) '../../../../styles/mixins.less';
.tab {
  .clickableBlockMixin();
  border-radius: 0;
  margin: 0;
  border: 0;
  flex: 1 1 0;
  text-align: center;
  height: 100%;
  overflow-x: visible;
  padding: var(--ironsworn-spacer-md);
  gap: 0.25em;
  justify-content: center;
  &:before {
    font-size: 140%;
  }
}
</style>

<script lang="ts" setup>
// TODO: figure out the nicest way to implement adding an icon.

import { clamp } from 'lodash'
import { computed, inject, ref, watch } from 'vue'
import {
  FocusActivePanel,
  FocusActivePanelKey,
  SetActiveTab,
  SetActiveTabKey,
  TabCountKey,
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
    /**
     * The component. This should be some kind of {@link HTMLButtonElement}, whether it's a plain `<button>` element or a button-based component.
     * @defaultValue 'button'
     */
    is?: any
  }>(),
  { disabled: false, is: 'button' }
)

const tabState = inject(TabStateKey)
const tabOrientation = inject(TabOrientationKey)
const tabCount = inject(TabCountKey) as number
const setActiveTab = inject(SetActiveTabKey) as SetActiveTab
const focusActivePanel = inject(FocusActivePanelKey) as FocusActivePanel

const isActive = computed(() => tabState?.activeTab === props.index)
const isFocused = computed(() => tabState?.focusedTab === props.index)
const activeTab = computed(() => tabState?.activeTab as number)
const $el = ref<HTMLButtonElement>()
const firstTabIndex = 0
const lastTabIndex = computed(() => tabCount - 1)

const tabSetId = computed(() => tabState?._id)
defineExpose({
  tabSetId: tabSetId.value,
})

watch(isFocused, () => $el.value?.focus())

function handleKeydown(event: KeyboardEvent) {
  const vertical = tabOrientation === 'vertical'
  const horizontal = tabOrientation === 'horizontal'

  console.log(
    vertical ? 'vertical' : 'horizontal',
    event.key,
    `tab: ${activeTab.value}`,
    `tabCount: ${tabCount}`
  )

  if (
    (horizontal && event.key === 'ArrowRight') ||
    (vertical && event.key === 'ArrowDown')
  ) {
    event.preventDefault()
    const nextTabIndex = clamp(
      activeTab.value + 1,
      firstTabIndex,
      lastTabIndex.value
    )
    console.log('focus on next tab', nextTabIndex)
    setActiveTab(nextTabIndex)
  }
  if (
    (horizontal && event.key === 'ArrowLeft') ||
    (vertical && event.key === 'ArrowUp')
  ) {
    event.preventDefault()
    const previousTabIndex = clamp(
      activeTab.value - 1,
      firstTabIndex,
      lastTabIndex.value
    )
    console.log('focus on previous tab', previousTabIndex)
    setActiveTab(previousTabIndex)
  }
  // If in horizontal mode, focus the active panel on ArrowDown, for screenreaders
  if (horizontal && event.key === 'ArrowDown') {
    console.log('focus on active panel')
    event.preventDefault()
    focusActivePanel()
  }
  if (event.key === 'Home') {
    console.log('focus on first tab')
    event.preventDefault()
    setActiveTab(0)
  }
  if (event.key === 'End') {
    console.log('focus on last tab')
    event.preventDefault()
    setActiveTab(tabCount - 1)
  }
}
</script>
