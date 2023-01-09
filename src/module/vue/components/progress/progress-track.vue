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
    :aria-valuetext="$t('IRONSWORN.PROGRESS.Current', { score, ticks })"
    :data-tooltip="$t('IRONSWORN.PROGRESS.Current', { score, ticks })"
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
@import '../../../../styles/mixins.less';
@box_border_radius: var(--ironsworn-border-radius-md);
@box_border_width: var(--ironsworn-border-width-md);
@box_gap: 4px;
.progress-track {
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  grid-auto-flow: column;
  gap: @box_gap;
  align-items: center;
  justify-content: center;
  &:focus {
    .focusOutlineMixin();
  }
  .progress-track-box {
    border-radius: @box_border_radius;
    max-width: var(--ironsworn-vertical-slider-width);
    max-height: var(--ironsworn-vertical-slider-width);
  }
  &.compact-progress {
    display: flex;
    flex-flow: row nowrap;
    gap: 0;
    .progress-track-box {
      flex-basis: 10%;
      margin: 0;
      border: @box_border_width solid currentColor;
      border-radius: 0;
      &:first-child {
        border-radius: @box_border_radius 0 0 @box_border_radius;
      }
      &:not(:first-child) {
        margin-left: calc(@box_border_width / -2);
      }
      &:last-child {
        border-radius: 0 @box_border_radius @box_border_radius 0;
      }
      &:not(:last-child) {
        margin-right: calc(@box_border_width / -2);
      }
      .progress-tick {
        // sets absolute width so compact progress doesn't totally disappear when displayed in the compact format
        vector-effect: non-scaling-stroke;
        stroke-width: 1px;
      }
    }
  }
}
</style>

<script setup lang="ts">
import { computed } from '@vue/runtime-core'
import { fill, clamp } from 'lodash'
import { NumericRank, RANKS } from '../../../constants.js'
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
