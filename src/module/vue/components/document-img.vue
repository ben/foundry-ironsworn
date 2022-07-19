<template>
  <img
    :src="document.img"
    :title="document.name"
    :style="style"
    :height="size"
    :width="size"
    class="nogrow"
    @click="click"
  />
</template>

<script setup lang="ts">
import { computed, inject } from '@vue/runtime-core'
import { $ActorKey, $ItemKey } from '../provisions'
const props = defineProps<{
  document: any
  size?: string
}>()

const style = computed(() => ({
  width: props.size ?? '50px',
  height: props.size ?? '50px',
  'flex-basis': 0,
}))

const $emit = defineEmits<{ (e: 'change', path: string) }>()
const $actor = inject($ActorKey, undefined)
const $item = inject($ItemKey, undefined)
function click() {
  const current = props.document.img
  const fp = new FilePicker({
    type: 'image',
    current: current,
    callback: (img) => {
      const doc = $actor ?? $item
      doc?.update({ img })
    },
  })
  return fp.browse()
}
</script>
