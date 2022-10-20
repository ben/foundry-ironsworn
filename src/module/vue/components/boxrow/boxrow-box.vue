<template>
  <div
    class="box btn-block"
    :class="{ selected }"
    @click="$emit('click', value)"
  >
    {{ text }}
  </div>
</template>

<script setup lang="ts">
defineProps<{ text: string; value: number; selected: boolean }>()
defineEmits(['click'])
</script>
