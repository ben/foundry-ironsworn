<template>
  <svg
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    :height="size ?? '100'"
    :width="size ?? '100'"
    viewBox="-55 -55 110 110"
  >
    <path
      v-for="(wedge, i) in computedWedges"
      :key="wedge.path"
      :d="wedge.path"
      fill="white"
      stroke="black"
      stroke-width="2"
      class="clickable svg"
      :class="wedgeClasses(i)"
      @mouseover="data.hovered = i"
      @mouseleave="data.hovered = -1"
      @click="click(i)"
    ></path>
  </svg>
</template>

<style lang="less" scoped>
svg {
  pointer-events: fill;
}
</style>

<script setup lang="ts">
import { reactive } from '@vue/reactivity'
import { computed } from 'vue'
const R = 50

function pathString(wedgeIdx, numWedges) {
  const wedgeAngle = (2 * Math.PI) / numWedges
  const startAngle = wedgeIdx * wedgeAngle - Math.PI / 2
  const x1 = R * Math.cos(startAngle)
  const y1 = R * Math.sin(startAngle)
  const x2 = R * Math.cos(startAngle + wedgeAngle)
  const y2 = R * Math.sin(startAngle + wedgeAngle)

  return `M0,0 L${x1},${y1} A${R},${R} 0 0,1 ${x2},${y2} z`
}

const props = defineProps<{
  wedges: number
  ticked: number
  size?: string
}>()

const data = reactive({ hovered: -1 })

const computedWedges = computed(() => {
  const ret = [] as { ticked: boolean; path: string }[]
  for (let i = 0; i < props.wedges; i++) {
    ret.push({
      ticked: props.ticked <= i + 1,
      path: pathString(i, props.wedges),
    })
  }
  return ret
})

function wedgeClasses(i) {
  return {
    hover: data.hovered >= i,
    selected: props.ticked > i,
  }
}

const $emit = defineEmits(['click'])
function click(i: number) {
  // If 1 is marked and the click is on the first wedge, clear the clock
  if (i === 0 && props.ticked === 1) {
    i = -1
  }
  $emit('click', i + 1)
}
</script>
