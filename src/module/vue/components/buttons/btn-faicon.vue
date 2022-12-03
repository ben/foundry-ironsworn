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
  &.fa-brands,
  &.fa-classic,
  &.fa-duotone,
  &.fa-light,
  &.fa-regular,
  &.fa-sharp,
  &.fa-sharp-solid,
  &.fa-solid,
  &.fa-thin,
  &.fab,
  &.fad,
  &.fal,
  &.far,
  &.fas,
  &.fass,
  &.fat {
    &:empty {
      &:before {
        padding: 0;
      }
    }
  }
}
</style>
