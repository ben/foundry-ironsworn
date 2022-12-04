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
/**
 * Container for {@link TabPanel} components. Should be descended from a {@link TabSet} component, and sibling to a {@link TabList} component.
 */
defineProps()
</script>
