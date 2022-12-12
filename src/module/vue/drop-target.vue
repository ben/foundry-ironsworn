<template>
  <component
    v-bind="($attrs, $props)"
    :is="is"
    :data-ironsworn-drop-type="dropType"
    :data-ironsworn-drop-active="state.active"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
import { onMounted, reactive } from 'vue'

const props = defineProps<{ is: any; dropType: string }>()

const state = reactive({
  active: false,
})

function dragStart(type: string) {
  if (type === props.dropType) state.active = true
}

function dragEnd(type: string) {
  if (type === props.dropType) state.active = false
}

onMounted(() => {
  CONFIG.IRONSWORN.emitter.on('dragStart', dragStart)
  CONFIG.IRONSWORN.emitter.on('dragEnd', dragEnd)
})
</script>
