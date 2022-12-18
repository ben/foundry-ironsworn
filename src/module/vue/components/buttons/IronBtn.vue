<template>
  <button
    class="icon-button"
    :class="{ [$style.ironBtn]: true, ...classes }"
    type="button"
    :tooltip="tooltip"
    :aria-label="tooltip"
    :data-tooltip="tooltip"
    :disabled="disabled"
    :aria-disabled="disabled"
  >
    <slot name="icon"></slot>
    <span v-if="hasDefaultSlot" class="button-text">
      <slot name="default"></slot>
    </span>
  </button>
</template>
<style lang="less" module>
.ironBtn {
  & > svg {
    // prevents extra hover effects from firing on icon hover
    pointer-events: none;
  }
}
</style>

<script setup lang="ts">
import { computed, ExtractPropTypes, useSlots } from 'vue'
import IronIcon from '../icon/iron-icon.vue'
import BtnIcon from './btn-icon.vue'

const props = withDefaults(defineProps<BtnIsIconProps>(), { disabled: false })

interface BtnIsIconProps extends ExtractPropTypes<typeof BtnIcon> {
  hoverBg?: boolean
  /**
   * Style the button with a block background?
   */
  block?: boolean
}

const classes = computed(() => {
  return {
    ['icon-bg-hover']: props.hoverBg,
    block: props.block,
    clickable: true,
  }
})
// so the span can be omitted if there's no slot content
const hasDefaultSlot = computed(() => {
  return !!useSlots().default?.()[0].children?.length
})
</script>
