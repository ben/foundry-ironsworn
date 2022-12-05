<template>
  <component
    :is="is"
    :class="{
      [$style.tabList]: true,
      flexcol: tabState.orientation === 'vertical',
      flexrow: tabState.orientation === 'horizontal',
    }"
    role="tablist"
    :aria-orientation="tabState.orientation"
    ref="$el"
  >
    <slot name="default"></slot>
  </component>
</template>

<style lang="less" module>
.tabList {
  // TODO:
  // * fun slidey animation by applying some kind of border stroke or gradient background image, and transitioning its offset? basically, apply it to 1/n of the height or width, where n == the number of tabs.
  flex-grow: 0;
  &[aria-orientation='horizontal'] {
    flex-flow: row nowrap;
    height: max-content;
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
import { computed, inject, provide, ref, useSlots } from 'vue'
import { TabCountKey, TabState, TabStateKey } from './tab-helpers.js'
import Tab from './tab.vue'
import TabList from './tab-list.vue'
/**
 * The container for individual {@link Tab} elements. Should be descended from a {@link TabSet} element (which should itself have a {@link TabPanels} descendant).
 *
 * Theoretically the {@link Tab}s don't need to be *direct* children. However the number of direct children in this component's default slot should still be 1:1 with the number of tabs. In other words, its direct children should only be {@link Tab}s or other elements that wrap exactly one {@link Tab} descendant.
 */
withDefaults(defineProps<{ is?: any }>(), { is: 'div' })
const tabState = inject(TabStateKey) as TabState
const $slots = useSlots()
const $el = ref<InstanceType<typeof TabList>>(null)

type NonUndefined<T> = T extends undefined ? never : T
type Slot = NonUndefined<typeof $slots.default>

function tabChildren(slot?: Slot) {
  if (!slot) {
    return []
  } else {
    // TODO: figure out a more sophisticated way of doing this?
    return slot() ?? []
  }
}

const tabCount = computed(() => tabChildren($slots?.default).length)
provide(TabCountKey, tabCount.value)

const tabSetId = computed(() => tabState?._id)
defineExpose({
  tabSetId: tabSetId.value,
})
</script>
