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
  overflow-x: visible;
  padding: var(--ironsworn-spacer-md);
  gap: var(--ironsworn-spacer-md);
  justify-content: v-bind(
    'tabOrientation === "horizontal" ? "center" : "left"'
  );
  text-align: v-bind('tabOrientation === "horizontal" ? "center" : "left"');
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
     * The component to use. Use {@link BtnFaicon} or {@link BtnIsicon} if you want an icon.
     * @defaultValue 'button'
     */
    is?: any
  }>(),
  { disabled: false, is: 'button' }
)

const tabState = inject(TabStateKey)
const tabOrientation = computed(() => tabState?.orientation)
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
  const vertical = tabOrientation.value === 'vertical'
  const horizontal = tabOrientation.value === 'horizontal'

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
    setActiveTab(previousTabIndex)
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
