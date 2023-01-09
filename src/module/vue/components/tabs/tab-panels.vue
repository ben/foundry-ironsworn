<template>
  <component
    :is="is"
    :data-tab-set="tabState.tabSetId"
    :class="{
      flexcol: tabState.orientation === 'vertical',
      flexrow: tabState.orientation === 'horizontal',
      [$style.tabPanels]: true,
      [$style.tabPanelsHorizontal]: tabState.orientation === 'horizontal',
      [$style.tabPanelsVertical]: tabState.orientation === 'vertical',
    }"
  >
    <slot></slot>
  </component>
</template>

<style lang="less" module>
.tabPanels {
  // ensures that the TabPanels have a recent ancestor for their absolute positioning.
  position: relative;
}

.tabPanelsHorizontal {
  // so the animation doesn't encroach on adjacent elements
  overflow-x: clip;
}

.tabPanelsVertical {
  // so the animation doesn't encroach on adjacent elements
  overflow-x: clip;
}
</style>

<script lang="ts" setup>
import { computed, inject } from 'vue'
import { TabState, TabStateKey } from './tab-helpers'

/**
 * Container for {@link TabPanel} components. Should be descended from a {@link TabSet} component.
 */
withDefaults(defineProps<{ is?: any }>(), { is: 'div' })

const tabState = inject(TabStateKey) as TabState

const tabSetId = computed(() => tabState.tabSetId)
defineExpose({
  tabSetId: tabSetId.value,
})
</script>
