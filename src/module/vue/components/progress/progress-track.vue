<template>
  <article
    class="progress-track"
    :class="{ compact: compactProgress }"
    :data-rank="numericRank"
    :data-ticks="ticks"
    :data-score="score"
    :aria-valuenow="ticks"
    :aria-valuetext="`${score} progress (${ticks} ticks)`"
    :data-tooltip="`${score} progress (${ticks} ticks)`"
  >
    <ProgressTrackBox
      v-for="(boxTicks, i) in boxes"
      :key="`progress-box-${i + 1}`"
      :ticks="boxTicks ?? 0"
      :isOverflowBox="legacyOverflow"
    />
    <slot></slot>
  </article>
</template>

<style lang="less">
@box_border_radius: 3px;
@box_border_width: 1px;
@box_gap: 4px;
.progress-track {
  display: grid;
  grid-auto-flow: column;
  grid-template-columns: repeat(10 1fr);
  justify-content: center;
  align-items: center;
  gap: @box_gap;
  .progress-track-box {
    max-height: 50px;
    max-width: 50px;
    border-radius: @box_border_radius;
  }
  &.compact {
    gap: 0;
    border: @box_border_width solid currentColor;
    border-radius: 3px;
    .progress-track-box {
      box-sizing: content-box;
      box-shadow: none;
      border: none;
      border-radius: 0;
      margin: 0;
      &:not(:first-child) {
        border-left: @box_border_width solid currentColor;
      }
    }
  }
}
</style>

<script setup lang="ts">
import { computed } from '@vue/runtime-core'
import { fill, clamp } from 'lodash'
import { RANKS } from '../../../constants.js'
import { NumericRank } from '../../../dataforged/import.js'
import ProgressTrackBox from './progress-track-box.vue'

const props = defineProps<{
  /**
   * The number of ticks marked on this track.
   */
  ticks: number
  /**
   * Use 'null' if it's an unranked track, such as a Legacy or classic Bonds.
   */
  rank: keyof typeof RANKS | null
  legacyOverflow?: boolean
  /**
   * When true, renders the progress bar for more compact display.
   */
  compactProgress?: boolean
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
