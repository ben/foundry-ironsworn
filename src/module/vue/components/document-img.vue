<template>
  <img
    :src="document.img"
    :title="document.name"
    :style="style"
    :height="size"
    :width="size"
    @click="click"
  />
</template>

<style lang="less" scoped></style>

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
