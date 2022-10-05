<template>
  <svg
    class="clock"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    :height="size ?? '100px'"
    :width="size ?? '100px'"
    viewBox="-55 -55 110 110"
    :aria-valuenow="ticked"
    :aria-valuetext="`${ticked}⁄${wedges}`"
  >
    <path
      v-for="(wedge, i) in segmentPaths"
      :key="wedge"
      :d="wedge"
      class="clock-segment svg"
      :aria-selected="props.ticked === i + 1"
      @click="click(i)"
      :data-tooltip="`${i + 1}⁄${wedges}`"
      :data-tooltip-direction="tooltipDirection(i + 1, wedges)"
    ></path>
  </svg>
</template>

<style lang="less" scoped>
svg.clock {
  // so that only *segment* hovers appear
  pointer-events: none;
  fill: var(--ironsworn-color-thematic);
  fill-opacity: var(--widget-fill-opacity);
  stroke: currentColor;
  stroke-width: var(--widget-stroke-width);
  aspect-ratio: 1;
  &[aria-valuenow='0']:not(:hover) {
    .clock-segment {
      fill-opacity: 0;
    }
  }
  .clock-segment {
    pointer-events: fill;
    cursor: pointer;
    vector-effect: non-scaling-stroke;
    transition: var(--std-animation);
    &:active {
      fill-opacity: var(--widget-fill-opacity);
    }
  }
  &:hover {
    fill-opacity: var(--widget-fill-opacity-preview);
    .clock-segment {
      &:hover {
        ~ .clock-segment {
          fill-opacity: 0;
        }
      }
    }
  }
  &:not(:hover) {
    .clock-segment {
      &[aria-selected='true'] {
        ~ .clock-segment {
          fill-opacity: 0;
        }
      }
    }
  }
}
</style>

<script setup lang="ts">
import { inRange, mean } from 'lodash'
import { computed } from 'vue'
const R = 50

function pathString(wedgeIdx: number, numWedges: number) {
  const wedgeAngle = (2 * Math.PI) / numWedges
  const startAngle = wedgeIdx * wedgeAngle - Math.PI / 2
  const x1 = R * Math.cos(startAngle)
  const y1 = R * Math.sin(startAngle)
  const x2 = R * Math.cos(startAngle + wedgeAngle)
  const y2 = R * Math.sin(startAngle + wedgeAngle)

  return `M0,0 L${x1},${y1} A${R},${R} 0 0,1 ${x2},${y2} z`
}

// TODO: make this handle a bit more sensibly
/**
 * Picks a sensible tooltip position for a given wedge in a clock.
 */
function tooltipDirection(currentWedge: number, maxWedge: number) {
  let increment = 1 / maxWedge
  let start = currentWedge / maxWedge
  let end = start + increment
  let mid = mean([start, end])
  let breakPoints = [0.125, 0.375, 0.625, 0.875]
  switch (true) {
    case inRange(mid, 0, breakPoints[0]): {
      return 'UP'
    }
    case inRange(mid, breakPoints[0], breakPoints[1]): {
      return 'RIGHT'
    }
    case inRange(mid, breakPoints[1], breakPoints[2]): {
      return 'DOWN'
    }
    case inRange(mid, breakPoints[2], breakPoints[3]): {
      return 'LEFT'
    }
    case inRange(mid, breakPoints[3], 1): {
      return 'UP'
    }
    default:
      return 'UP'
  }
}

const props = defineProps<{
  /**
   * The total number of segments
   */
  wedges: number
  /**
   * The number of filled clock segments.
   */
  ticked: number
  /**
   * The size of the clock to be used as the widget's `height` and `width` attributes.
   */
  size?: string
}>()

const segmentPaths = computed(() => {
  const ret: string[] = []
  for (let i = 0; i < props.wedges; i++) {
    ret.push(pathString(i, props.wedges))
  }
  return ret
})

const $emit = defineEmits(['click'])
function click(i: number) {
  // If 1 is marked and the click is on the first wedge, clear the clock
  if (i === 0 && props.ticked === 1) {
    i = -1
  }
  $emit('click', i + 1)
}
</script>
