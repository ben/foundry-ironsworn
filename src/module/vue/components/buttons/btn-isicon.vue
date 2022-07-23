<template>
  <btn-icon
    :class="classes"
    @click="$emit('click')"
    :tooltip="tooltip"
    :disabled="disabled"
  >
    <slot></slot>
  </btn-icon>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import btnIcon from './btn-icon.vue'

defineEmits(['click'])

const props = defineProps<{
  icon: string
  tooltip?: string
  hoverBg?: boolean
  disabled?: boolean
}>()

const classes = computed(() => {
  return {
    [`isicon-${props.icon}`]: true,
    ['icon-bg-hover']: props.hoverBg,
  }
})
</script>

