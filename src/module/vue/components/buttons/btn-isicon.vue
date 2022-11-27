<template>
  <btn-icon
    :class="{ [`isicon-${props.icon}`]: true }"
    v-bind="props"
    @click="$emit('click')"
  >
    <slot name="default"></slot>
  </btn-icon>
</template>

<script setup lang="ts">
import btnIcon from './btn-icon.vue'

defineEmits(['click'])

const props = defineProps<{
  icon: string
  // FIXME: shared props, inherit them once Vue adds support in 3.3
  tooltip?: string
  disabled?: boolean
  buttonStyle?:
    | 'iconOnly'
    | 'iconHoverBlock'
    | 'blockBorder'
    | 'blockBorderless'
    | 'text'
  hoverBg?: boolean
}>()
</script>
