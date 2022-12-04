<template>
  <component
    :is="is"
    :data-ironsworn-drop-type="dropType"
    :data-ironsworn-drop-active="false"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
defineProps<{ is: any; dropType: string }>()
</script>
