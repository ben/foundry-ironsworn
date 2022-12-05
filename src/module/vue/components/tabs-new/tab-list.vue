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
    border-block-end: var(--ironsworn-border-width-md) solid
      var(--ironsworn-color-border);
  }
  &[aria-orientation='vertical'] {
    border-inline-start: var(--ironsworn-border-width-md) solid
      var(--ironsworn-color-border);
    border-inline-end: var(--ironsworn-border-width-md) solid
      var(--ironsworn-color-border);
  }
}
</style>

<script lang="ts" setup>
import { computed, inject, provide, useSlots } from 'vue'
import {
  cleanChildren,
  IsOnFirstTabKey,
  IsOnLastTabKey,
  TabCountKey,
  TabOrientationKey,
  TabState,
  TabStateKey,
} from './tab-helpers.js'
/**
 * The container for individual {@link Tab} elements. Should be descended from a {@link TabSet} element (which should itself have a {@link TabPanels} descendant).
 */
defineProps()

const tabState = inject(TabStateKey) as TabState
const tabOrientation = inject(TabOrientationKey)
const $slots = useSlots()

type NonUndefined<T> = T extends undefined ? never : T

const tabCount = computed(() => {
  const slot = ($slots?.default as NonUndefined<typeof $slots.default>)()
  console.log(slot)
  const tabs = cleanChildren(slot)
  return tabs.length
})
const isOnLastTab = computed(() => tabState.activeTab === tabCount.value)
const isOnFirstTab = computed(() => tabState.activeTab === 0)

provide(TabCountKey, tabCount.value)
provide(IsOnFirstTabKey, isOnFirstTab.value)
provide(IsOnLastTabKey, isOnLastTab.value)
</script>
