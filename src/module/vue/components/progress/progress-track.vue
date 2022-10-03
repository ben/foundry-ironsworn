<template>
  <article
    :tabindex="0"
    class="progress-track"
    :class="{
      ['compact-progress']: compactProgress,
    }"
    role="slider"
    :aria-label="$t('IRONSWORN.PROGRESS.Track')"
    aria-orientation="horizontal"
    :data-rank="numericRank"
    :data-ticks="ticks"
    :data-score="score"
    :aria-valuenow="ticks"
    :aria-valuemin="0"
    :aria-valuemax="40"
    :aria-valuetext="`${score} progress (${ticks} ticks)`"
    :data-tooltip="`${score} progress (${ticks} ticks)`"
  >
    <ProgressTrackBox
      v-for="(boxTicks, i) in boxes"
      tabindex="-1"
      role="presentational"
      :key="`progress-box-${i + 1}`"
      :ticks="boxTicks ?? 0"
      :isOverflowBox="legacyOverflow"
    />
  </article>
</template>

<style lang="less">
@box_border_radius: 3px;
@box_border_width: 1px;
@box_gap: 4px;
.progress-track {
  &:focus {
    box-shadow: 0 0 5px var(--color-shadow-primary);
  }
  display: grid;
  grid-auto-flow: column;
  grid-template-columns: repeat(10, 1fr);
  justify-content: center;
  align-items: center;
  gap: @box_gap;
  .progress-track-box {
    max-height: 50px;
    max-width: 50px;
    border-radius: @box_border_radius;
  }
  &.compact-progress {
    gap: 0;
    display: flex;
    flex-flow: row nowrap;
    .progress-track-box {
      flex-basis: 10%;
      border: @box_border_width solid currentColor;
      .progress-tick {
        // sets absolute width so compact progress doesn't totally disappear when displayed in the compact format
        vector-effect: non-scaling-stroke;
        stroke-width: 1px;
      }
      border-radius: 0;
      margin: 0;
      &:first-child {
        border-radius: @box_border_radius 0 0 @box_border_radius;
      }
      &:not(:first-child) {
        margin-left: -(@box_border_width / 2);
      }
      &:last-child {
        border-radius: 0 @box_border_radius @box_border_radius 0;
      }
      &:not(:last-child) {
        margin-right: -(@box_border_width / 2);
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
