<template>
  <article class="track" :data-rank="numericRank">
    <div class="flexcol track-box" v-for="(box, i) in boxes" :key="'box' + i">
      <ProgressMark :ticks="box"></ProgressMark>
    </div>
  </article>
</template>

<style lang="less">
.track {
  display: grid;
  grid-auto-flow: column;
  gap: 4px;
  justify-items: center;
  align-self: center;
  .track-box {
    max-height: 50px;
    max-width: 50px;
    border: 1px solid;
    align-items: center;
    justify-items: center;
    aspect-ratio: 1;
    border-radius: 3px;
    object-fit: contain;
    box-shadow: 2px 2px 0 currentColor;
    .track-box-marks {
      margin: 5px;
    }
  }
}
</style>

<script setup lang="ts">
import { computed } from '@vue/runtime-core'
import { times } from 'lodash'
import { RANKS } from '../../../constants.js'
import { getNumericRank } from '../../../dataforged.js'
import ProgressMark from './progress-mark.vue'

const props = withDefaults(
  defineProps<{ ticks: number; rank: keyof typeof RANKS }>(),
  {
    rank: 'epic',
  }
)

const numericRank = computed(() => getNumericRank(props.rank))

const boxes = computed(() => {
  const maxBoxes = 10
  const ticksPerBox = 4
  const filledBoxes = Math.floor(props.ticks / ticksPerBox)
  const ticksRemainder = props.ticks % 4
  let boxTicks = [...times(filledBoxes, () => 4), ticksRemainder]
  boxTicks = [...boxTicks, ...times(maxBoxes - (filledBoxes + 1), () => 0)]
  return boxTicks.slice(0, 10)
})
</script>
