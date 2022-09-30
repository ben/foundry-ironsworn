<template>
  <article
    class="track"
    :data-rank="numericRank"
    :data-ticks="ticks"
    :data-score="score"
    :aria-valuenow="ticks"
    :aria-valuetext="`${score} progress (${ticks} ticks)`"
    :data-tooltip="`${score} progress (${ticks} ticks)`"
  >
    <TrackBox
      v-for="(boxTicks, i) in boxes"
      :key="`box-${i + 1}`"
      :ticks="boxTicks ?? 0"
      :ghostMark="legacyOverflow"
    />
    <slot></slot>
  </article>
</template>

<style lang="less">
.track {
  display: grid;
  grid-auto-flow: column;
  gap: 4px;
  justify-content: center;
  align-self: center;
  .track-box {
    max-height: 50px;
    max-width: 50px;
  }
}
</style>

<script setup lang="ts">
import { computed } from '@vue/runtime-core'
import { fill, clamp } from 'lodash'
import { RANKS } from '../../../constants.js'
import { NumericRank } from '../../../dataforged/import.js'
import TrackBox from './track-box.vue'

const props = defineProps<{
  ticks: number
  rank: keyof typeof RANKS | null
  legacyOverflow?: boolean
}>()

const minBoxes = 0
const maxBoxes = 10
const ticksPerBox = 4
const maxTicks = maxBoxes * ticksPerBox

const score = computed(() =>
  clamp(Math.floor(props.ticks / ticksPerBox), minBoxes, maxBoxes)
)

const numericRank = computed(() =>
  props.rank != null ? NumericRank[props.rank] : null
)

const visibleTicks = computed(() =>
  props.ticks > maxTicks ? props.ticks % maxTicks : props.ticks
)

const boxes = computed(() => {
  const boxTicks = Array<number>(maxBoxes)
  const filledBoxes = Math.floor(visibleTicks.value / ticksPerBox)
  const ticksRemainder = visibleTicks.value % ticksPerBox

  fill(boxTicks, ticksPerBox, 0, filledBoxes)
  if (ticksRemainder > 0) {
    boxTicks[filledBoxes] = ticksRemainder
  }
  return boxTicks
})
</script>
