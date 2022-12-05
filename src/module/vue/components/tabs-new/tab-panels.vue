<template>
  <div :class="$style.tabPanels">
    <slot></slot>
  </div>
</template>

<style lang="less" module>
.tabPanels {
  display: flex;
  flex-grow: 1;
  width: v-bind('orientation === "horizontal" ? "100%" : "auto"');
  height: v-bind('orientation === "vertical" ? "100%" : "auto"');
}
</style>

<script lang="ts" setup>
import { computed, inject } from 'vue'
import { TabOrientationKey, TabStateKey } from './tab-helpers'

/**
 * Container for {@link TabPanel} components. Should be descended from a {@link TabSet} component, and sibling to a {@link TabList} component.
 */
defineProps()

const orientation = inject(TabOrientationKey)

const tabState = inject(TabStateKey)

const tabSetId = computed(() => tabState?._id)
defineExpose({
  tabSetId: tabSetId.value,
})
</script>
