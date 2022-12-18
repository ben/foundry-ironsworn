<template>
  <button
    class="iron-btn"
    :class="{ [$style.ironBtn]: true, ...classes }"
    type="button"
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
  display: flex;
  align-items: center;
  flex-flow: row nowrap;
  align-content: center;
  text-align: center;
  justify-content: center;
  border-radius: 0;
  color: inherit;
  border-width: 0;
  padding: 0.2em;
  gap: 0.2em;
  & > svg {
    // prevents extra hover effects from firing on icon hover
    pointer-events: none;
  }
  & > .icon {
  }
  &:not(.block) > .button-text {
    justify-self: left;
  }
}
.iconOnly {
}
</style>

<script setup lang="ts">
import { computed, useSlots } from 'vue'

/**
 * Generic button that applies styles and behaviour common to this system.
 */
const props = withDefaults(
  defineProps<{
    tooltip?: string
    hoverBg?: boolean
    /**
     * Should the button be styled with a block background?
     */
    block?: boolean
    disabled?: boolean
    /**
     * Should the button grow in flex containers?
     */
    nogrow?: boolean
  }>(),
  { disabled: false }
)

const classes = computed(() => {
  return {
    ['icon-bg-hover']: props.hoverBg,
    block: props.block,
    nogrow: props.nogrow,
    clickable: true,
  }
})
// so the span can be omitted if there's no slot content
const hasDefaultSlot = computed(() => {
  return !!useSlots().default?.()[0]
})

const hasIconSlot = computed(() => {
  return !!useSlots().icon?.()[0]
})
</script>
