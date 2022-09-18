<template>
  <svg
    class="svg-hex"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    :viewBox="viewBox"
  >
    <polygon
      vector-effect="non-scaling-stroke"
      :points="pointyHexPolygon(center, hexHeight)"
    />
  </svg>
</template>

<style lang="less" scoped>
.svg-hex {
  aspect-ratio: (sqrt(3) / 2) / 1;
}
</style>

<script setup lang="ts">
import { computed } from '@vue/reactivity'
import { times } from 'lodash'

const sides = 6
const hexHeight = 10

const hexWidth = computed(() => hexHeight * (Math.sqrt(3) / 2))

const center = { x: -hexWidth.value / 2, y: -hexHeight / 2 }

const viewBox = computed(
  () =>
    `-${toSigDigits(hexHeight)} -${toSigDigits(hexWidth.value)} ${toSigDigits(
      hexHeight
    )} ${toSigDigits(hexWidth.value)}`
)

function toSigDigits(value: number) {
  return Number(value.toFixed(2))
}

// cribbed from https://www.redblobgames.com/grids/hexagons/
function pointyHexCorner(center: Point, radius: number, index: number): Point {
  let angleDegrees = 60 * index - 30
  let angleRadius = (Math.PI / 180) * angleDegrees
  return {
    x: toSigDigits(center.x + radius * Math.cos(angleRadius)),
    y: toSigDigits(center.y + radius * Math.sin(angleRadius)),
  }
}

function pointyHexPolygon(center: Point, height: number) {
  const radius = height / 2
  let points = times(sides, (i) => pointyHexCorner(center, radius, i))
  let pointsString = points.map((point) => `${point.x},${point.y}`).join(' ')
  return pointsString
}
</script>
