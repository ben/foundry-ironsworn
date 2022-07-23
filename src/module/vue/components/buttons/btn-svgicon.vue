<template>
  <btn-icon
    class="svg-icon"
    :class="classes"
    @click="$emit('click')"
    :tooltip="tooltip"
    :disabled="disabled"
  >
    <slot></slot>
  </btn-icon>
</template>

<style lang="less">
.svg-icon {
  &:before {
    content: '';
    height: 1.25em;
    width: 1.25em;
    background-color: currentColor;
    mask-size: contain;
    mask-position: center;
    mask-repeat: no-repeat;
  }
  &.icon-bg-hover {
    position: relative;
    -webkit-text-stroke: 2px white;
    paint-order: stroke fill;
    > * {
      z-index: 2;
    }
    &:before {
      height: 100%;
      width: 100%;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 1;
      pointer-events: none;
      box-sizing: border-box;
      opacity: 0;
      transition: all ease-in-out 0.25s;
      padding: 0.25rem;
      mask-origin: content-box;
    }
    &:hover:before {
      opacity: 0.2;
    }
  }
}
.svg-d10-tilt:before {
  mask-image: url('./systems/foundry-ironsworn/assets/d10v4.svg');
}
.svg-oracle:before {
  mask-image: url('./systems/foundry-ironsworn/assets/oracle.svg');
}
.svg-d6-pips:before {
  mask-image: url('./systems/foundry-ironsworn/assets/d6-pips.svg');
}
</style>

<script setup lang="ts">
import { computed } from '@vue/runtime-core'
const props = defineProps<{
  tooltip?: string
  icon: string
  hoverBg?: boolean
  disabled?: boolean
}>()
defineEmits(['click'])

const classes = computed(() => {
  return {
    [`svg-${props.icon}`]: true,
    ['icon-bg-hover']: props.hoverBg,
  }
})
</script>
