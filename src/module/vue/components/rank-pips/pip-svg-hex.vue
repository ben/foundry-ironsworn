<template>
  <svg
    class="svg-hex"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    :viewBox="viewBox"
  >
    <polygon :points="pointyHexPath(center, hexHeight)" />
  </svg>
</template>

<style lang="less" scoped>
.svg-hex {
  aspect-ratio: (sqrt(3) / 2) / 1;
}
</style>

<script setup lang="ts">
// TODO: make this without bothering to specify specific height/width? idfk
import { computed } from '@vue/reactivity'
import { times } from 'lodash'

const sides = 6
const hexHeight = 10

const longRadius = computed(() => hexHeight / 2)
const shortRadius = computed(() => longRadius.value * (Math.sqrt(3) / 2))
const hexWidth = computed(() => hexHeight * (Math.sqrt(3) / 2))

const center = { x: -hexWidth.value / 2, y: -hexHeight / 2 }

const viewBox = computed(
  () => `-${hexHeight} -${hexWidth.value} ${hexHeight} ${hexWidth.value}`
)

defineExpose({
  hexHeight,
  longRadius: longRadius.value,
  shortRadius: shortRadius.value,
  hexWidth: hexWidth.value,
})

// cribbed from https://www.redblobgames.com/grids/hexagons/
function pointyHexCorner(center: Point, radius: number, index: number): Point {
  let angleDegrees = 60 * index - 30
  let angleRadius = (Math.PI / 180) * angleDegrees
  return {
    x: center.x + radius * Math.cos(angleRadius),
    y: center.y + radius * Math.sin(angleRadius),
  }
}

function pointyHexPath(center: Point, height: number) {
  const radius = height / 2
  let points = times(sides, (i) => pointyHexCorner(center, radius, i))
  let pointsString = points.map((point) => `${point.x},${point.y}`).join(' ')
  return pointsString
}
</script>
