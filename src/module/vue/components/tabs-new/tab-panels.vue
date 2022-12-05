<template>
  <div
    :class="{
      [$style.tabPanels]: true,
      flexcol: orientation === 'vertical',
      flexrow: orientation === 'horizontal',
    }"
  >
    <slot></slot>
  </div>
</template>

<style lang="less" module>
.tabPanels {
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
