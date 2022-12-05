<template>
  <div :class="$style.tabPanels">
    <slot></slot>
  </div>
</template>

<style lang="less" module>
.tabPanels {
}
</style>

<script lang="ts" setup>
import { computed, inject } from 'vue'
import { TabStateKey } from './tab-helpers'

/**
 * Container for {@link TabPanel} components. Should be descended from a {@link TabSet} component, and sibling to a {@link TabList} component.
 */
defineProps()

const tabState = inject(TabStateKey)

const tabSetId = computed(() => tabState?._id)
defineExpose({
  tabSetId: tabSetId.value,
})
</script>
