<template>
  <div
    :class="$style.tabList"
    role="tablist"
    :aria-orientation="tabOrientation"
  >
    <slot></slot>
  </div>
</template>

<style lang="less" module>
.tabList {
  // TODO:
  // * styling for horizontal and vertical use
  // * fun slidey animation by applying some kind of border stroke or background image, and transitioning its offset? basically, apply it to 1/n of the height or width, where n == the number of tabs.
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  flex-grow: 0;
  height: max-content;

  &[aria-orientation='horizontal'] {
    border-bottom: var(--ironsworn-border-width-md) solid
      var(--ironsworn-color-border);
  }
  &[aria-orientation='vertical'] {
    border-left: var(--ironsworn-border-width-md) solid
      var(--ironsworn-color-border);
    border-right: var(--ironsworn-border-width-md) solid
      var(--ironsworn-color-border);
  }
}
</style>

<script lang="ts" setup>
import { computed, inject, provide, useSlots } from 'vue'
import {
  IsOnFirstTabKey,
  IsOnLastTabKey,
  TabCountKey,
  TabOrientationKey,
  TabState,
  TabStateKey,
} from './tab-helpers.js'
import Tab from './tab.vue'
/**
 * The container for individual {@link Tab} elements. Should be descended from a {@link TabSet} element (which should itself have a {@link TabPanels} descendant).
 */
defineProps()

const tabState = inject(TabStateKey) as TabState
const tabOrientation = inject(TabOrientationKey)
const $slots = useSlots()

type NonUndefined<T> = T extends undefined ? never : T
type Slot = NonUndefined<typeof $slots.default>

function cleanChildren(slot?: Slot) {
  if (!slot) {
    return []
  } else {
    const vnodes = slot()
    if (!vnodes) return []
    // FIXME: is there a good way to filter for only the rendered children?
    return vnodes
    // .filter((vnode: any) => vnode)
  }
}

const tabCount = computed(() => {
  console.log('TabList.$slots', $slots)
  const tabs = cleanChildren($slots?.default)
  return tabs.length
})
const isOnLastTab = computed(() => tabState.activeTab === tabCount.value)
const isOnFirstTab = computed(() => tabState.activeTab === 0)

const tabSetId = computed(() => tabState?._id)
defineExpose({
  tabSetId: tabSetId.value,
})

provide(TabCountKey, tabCount.value)
provide(IsOnFirstTabKey, isOnFirstTab.value)
provide(IsOnLastTabKey, isOnLastTab.value)
</script>
