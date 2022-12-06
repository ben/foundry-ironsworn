<template>
  <component
    :is="is"
    :data-tab-set="tabState.tabSetId"
    :class="{
      flexcol: tabState.orientation === 'vertical',
      flexrow: tabState.orientation === 'horizontal',
    }"
  >
    <slot></slot>
  </component>
</template>

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
