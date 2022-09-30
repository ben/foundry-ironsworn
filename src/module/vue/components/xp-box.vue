<template>
  <div
    class="xp-box-classic clickable block"
    @click="$emit('click')"
    :class="classes"
    data-resource="xp"
  >
    <slot />
  </div>
</template>
<style lang="less"></style>
<script setup lang="ts">
import { computed } from '@vue/runtime-core'
const props = defineProps<{ value: number; current: number }>()

const classes = computed(() => {
  return {
    selected: selected.value,
  }
})
const selected = computed(() => {
  return props.value <= props.current
})

defineEmits(['click'])
</script>
