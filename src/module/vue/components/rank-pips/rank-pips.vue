<template>
  <article
    class="rank-pips"
    :aria-label="$t('IRONSWORN.ChallengeRank')"
    :aria-valuetext="current"
  >
    <button
      v-for="rankData in ranks"
      :key="rankData.rank"
      @click="$emit('click', rankData.rank)"
      :title="
        !versionHasTooltips ? $t(`IRONSWORN.${$capitalize(rankData.rank)}`) : ''
      "
      :data-tooltip="$t(`IRONSWORN.${$capitalize(rankData.rank)}`)"
      data-tooltip-direction="UP"
      type="button"
      class="rank-pip nogrow"
      :aria-selected="rankData.rank === current"
    >
      <PipSvgCircle
        v-if="pipStyle === 'circle'"
        role="presentational"
        class="svg clickable"
        height="20px"
      />
      <PipSvgHex
        v-if="pipStyle === 'hex'"
        role="presentational"
        class="svg clickable"
        :height="20 + 'px'"
        width="auto"
      />
    </button>
  </article>
</template>

<style lang="less" scoped>
.rank-pips {
  display: flex;
  flex-flow: row nowrap;
  fill: currentColor;
  fill-opacity: 1;
  stroke: currentColor;
  stroke-width: 1;
  vector-effect: non-scaling-stroke;
  &:hover {
    fill-opacity: 0.25;
  }
  &:not(:hover) {
    .rank-pip {
      &[aria-selected='true'] {
        ~ .rank-pip {
          fill-opacity: 0;
        }
      }
    }
  }
  .rank-pip {
    padding: 0;
    height: max-content;
    width: max-content;
    line-height: 0;
    display: flex;
    &:hover {
      ~ .rank-pip {
        fill-opacity: 0;
      }
    }
  }
}
</style>

<script setup lang="ts">
import { computed } from '@vue/runtime-core'
import { RANKS } from '../../../constants'
import PipSvgHex from './pip-svg-hex.vue'
import PipSvgCircle from './pip-svg-circle.vue'

const props = withDefaults(
  defineProps<{
    current: keyof typeof RANKS
    pipStyle: 'hex' | 'circle'
  }>(),
  {
    pipStyle: 'hex',
  }
)

const ranks = computed(() => {
  const keys = Object.keys(RANKS)
  const position = keys.indexOf(props.current)
  return keys.map((r) => {
    const rankIndex = keys.indexOf(r)
    return {
      rank: r,
    }
  })
})

/**
 * Tests whether the client's version includes a tooltip API.
 */
const versionHasTooltips = computed(
  () => !!(game as { tooltip?: unknown }).tooltip
)

defineEmits(['click'])
</script>
