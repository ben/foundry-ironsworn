<template>
  <img
    class="document-img"
    :src="document.img"
    :title="document.name"
    :style="style"
    :height="size"
    :width="size"
    @click="click"
  />
</template>

<style lang="less">
.document-img {
  cursor: pointer;
}

.theme-ironsworn .document-img[src$='.svg'] {
  // tint so that the default fill of included vector icons (white) is at least nominally visible on a white ground.
  background-color: rgba(0, 0, 0, 0.2);
}
</style>

<script setup lang="ts">
import { computed, inject } from '@vue/runtime-core'
import { $ActorKey, $ItemKey } from '../provisions'
const props = withDefaults(
  defineProps<{
    document: any
    size: string
  }>(),
  { size: '50px' }
)

const style = computed(() => ({
  width: props.size,
  height: props.size,
}))

const $actor = inject($ActorKey, undefined)
const $item = inject($ItemKey, undefined)
function click() {
  const current = props.document.img
  const fp = new FilePicker({
    type: 'image',
    current: current,
    callback: (img) => {
      const doc = $item ?? $actor
      doc?.update({ img })
    },
  })
  return fp.browse(current)
}
</script>
