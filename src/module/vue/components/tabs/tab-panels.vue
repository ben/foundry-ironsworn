<template>
  <component
    :is="is"
    :class="{
      flexcol: tabState.orientation === 'vertical',
      flexrow: tabState.orientation === 'horizontal',
    }"
  >
    <slot name="before"></slot>
    <slot name="default"></slot>
    <slot name="after"></slot>
  </component>
</template>

<script lang="ts" setup>
import { computed, inject } from 'vue'
import { TabStateKey } from './tab-helpers'

/**
 * Container for {@link TabPanel} components. Should be descended from a {@link TabSet} component, and sibling to a {@link TabList} component.
 */
withDefaults(defineProps<{ is?: any }>(), { is: 'div' })

const tabState = inject(TabStateKey)

const tabSetId = computed(() => tabState?._id)
defineExpose({
  tabSetId: tabSetId.value,
})
</script>
