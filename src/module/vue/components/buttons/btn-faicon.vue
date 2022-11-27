<template>
  <btn-icon
    :class="classes"
    :tooltip="tooltip"
    :disabled="disabled"
    v-bind="props"
    @click="$emit('click')"
  >
    <slot name="default"></slot>
  </btn-icon>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import BtnIcon from './btn-icon.vue'

const props = withDefaults(
  defineProps<{
    icon: string
    /**
     * @see https://fontawesome.com/docs/web/style/rotate
     */
    rotate?: 90 | 180 | 270
    sharp?: boolean
    solid?: boolean
    // FIXME: vue 3.3 will allow non-type-literal types. once that's possible, we can make this DRYer
    tooltip?: string
    disabled?: boolean
    buttonStyle?:
      | 'iconOnly'
      | 'iconHoverBlock'
      | 'blockBorder'
      | 'blockBorderless'
      | 'text'
    hoverBg?: boolean
  }>(),
  { solid: true }
)

defineEmits(['click'])

const classes = computed(() => ({
  [`fa-rotate-${props.rotate}`]: !!props.rotate,
  ['fa-solid']: props.solid,
  ['fa-classic']: !props.solid,
  ['fa-sharp']: props.sharp,
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
