<template>
  <!-- TODO: as radio set -->
  <div
    class="clickable block stack-row"
    :class="selectedClass"
    @click="$emit('click')"
  >
    {{ opt.name }}
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ opt: any }>()
const selectedClass = computed(() => ({
  selected: props.opt.selected,
}))
</script>
