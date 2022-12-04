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
}
</style>

<script lang="ts" setup>
import { computed, inject, provide, Slot, useSlots } from 'vue'
import {
  cleanChildren,
  IsOnFirstTabKey,
  IsOnLastTabKey,
  TabCountKey,
  TabOrientationKey,
  TabState,
  TabStateKey,
} from './tab-helpers.js'

const tabState = inject(TabStateKey) as TabState
const tabOrientation = inject(TabOrientationKey)
const $slots = useSlots()

const tabCount = computed(() => {
  const slot = ($slots?.default as Slot)()
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
