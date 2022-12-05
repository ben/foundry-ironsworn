<template>
  <component
    :is="is"
    :class="{
      flexcol: orientation === 'vertical',
      flexrow: orientation === 'horizontal',
    }"
  >
    <slot name="before"></slot>
    <slot name="default"></slot>
    <slot name="after"></slot>
  </component>
</template>

<script lang="ts" setup>
import { computed, inject } from 'vue'
import { TabOrientationKey, TabStateKey } from './tab-helpers'

/**
 * Container for {@link TabPanel} components. Should be descended from a {@link TabSet} component, and sibling to a {@link TabList} component.
 *
 * The default slot is for tab panels. content shared between all panels can be placed in its other slots.
 */
withDefaults(defineProps<{ is?: any }>(), { is: 'div' })

const orientation = inject(TabOrientationKey)

const tabState = inject(TabStateKey)

const tabSetId = computed(() => tabState?._id)
defineExpose({
  tabSetId: tabSetId.value,
})
</script>
