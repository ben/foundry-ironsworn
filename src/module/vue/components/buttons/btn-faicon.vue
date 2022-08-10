<template>
  <btn-icon
    :class="classes"
    :tooltip="tooltip"
    :disabled="disabled"
    @click="$emit('click')"
  >
    <slot name="default"></slot>
  </btn-icon>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import BtnIcon from './btn-icon.vue'

const props = defineProps({
  icon: { type: String, required: true },
  solid: { type: Boolean, default: true },
  tooltip: String,
  hoverBg: Boolean,
  disabled: Boolean,
})

defineEmits(['click'])

const classes = computed(() => ({
  fas: props.solid,
  far: !props.solid,
  [`fa-${props.icon}`]: true,
  ['icon-bg-hover']: props.hoverBg,
}))
</script>

<style lang="less">
.icon-button {
  &.fa,
  &.fas,
  &.far {
    &:not(:before) {
      -moz-osx-font-smoothing: inherit;
      -webkit-font-smoothing: inherit;
      display: inherit;
      font-style: inherit;
      font-variant: inherit;
      text-rendering: inherit;
      line-height: inherit;
      font-family: inherit;
    }
  }
}
</style>
