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
    <ProgressListItem v-for="(box, i) in boxes" :key="'box' + i" :ticks="box" />
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
import { fill, clamp, compact } from 'lodash'
import { RANKS } from '../../../constants.js'
import { NumericRank } from '../../../dataforged.js'
import ProgressListItem from './track-box.vue'

const props = withDefaults(
  defineProps<{ ticks: number; rank: keyof typeof RANKS }>(),
  {
    rank: 'epic',
  }
)

const minBoxes = 0
const maxBoxes = 10
const ticksPerBox = 4
const maxTicks = maxBoxes * ticksPerBox
const emptyBox = 0

const score = computed(() =>
  clamp(Math.floor(props.ticks / ticksPerBox), minBoxes, maxBoxes)
)

const numericRank = computed(() => NumericRank[props.rank])

const visibleTicks = computed(() =>
  props.ticks > maxTicks ? props.ticks % maxTicks : props.ticks
)

const boxes = computed(() => {
  const filledBoxes = Math.floor(visibleTicks.value / ticksPerBox)
  const ticksRemainder = visibleTicks.value % ticksPerBox

  let boxTicks = Array<number>(maxBoxes)
  fill(boxTicks, ticksPerBox, 0, filledBoxes)
  if (ticksRemainder > 0) {
    boxTicks[filledBoxes] = ticksRemainder
  }
  if (compact(boxTicks).length > 10) {
    fill(boxTicks, emptyBox, filledBoxes + 1)
  }
  console.log('boxTicks', boxTicks)
  console.log('visibleTicks', visibleTicks.value)
  return boxTicks
})
</script>
