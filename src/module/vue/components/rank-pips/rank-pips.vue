<template>
  <article
    class="rank-pips"
    :aria-label="$t('IRONSWORN.ChallengeRank')"
    :aria-valuetext="current"
  >
    <button
      v-for="rank in ranks"
      :key="rank"
      @click="$emit('click', rank)"
      :title="!versionHasTooltips ? $t(`IRONSWORN.${$capitalize(rank)}`) : ''"
      :data-tooltip="$t(`IRONSWORN.${$capitalize(rank)}`)"
      data-tooltip-direction="UP"
      type="button"
      class="rank-pip nogrow theme-pip"
      :aria-selected="rank === current"
    >
      <PipSvgCircle
        v-if="pipStyle === 'circle'"
        role="presentational"
        class="svg pip-shape"
      />
      <PipSvgHex
        v-if="pipStyle === 'hex'"
        role="presentational"
        class="svg pip-shape"
      />
    </button>
  </article>
</template>

<style lang="less">
.rank-pips {
  .rank-pip {
    .pip-shape > * {
      stroke-width: var(--widget-stroke-width);
    }
  }
}
</style>
<style lang="less" scoped>
.rank-pips {
  // so that hover effects only happen when a pip is hovered
  pointer-events: none;
  display: flex;
  flex-flow: row nowrap;
  stroke: currentColor;
  fill: var(--ironsworn-color-thematic);
  fill-opacity: var(--widget-fill-opacity);
  align-content: center;
  gap: 2px;
  transition: var(--std-animation);
  &:hover {
    fill-opacity: var(--widget-fill-opacity-preview);
  }
  button.rank-pip {
    background-color: unset;
    pointer-events: all;
    display: flex;
    height: auto;
    padding: 0;
    line-height: 0;
    display: flex;
    justify-items: center;
    align-items: center;
    transition-duration: 0s;
    .pip-shape {
      height: inherit;
      overflow: visible;
      width: 1em;
    }
    &:hover {
      box-shadow: unset;
      color: currentColor;
      ~ .rank-pip {
        fill-opacity: 0;
      }
    }
  }
  &:not(:hover) {
    button.rank-pip {
      &[aria-selected='true'] {
        ~ button.rank-pip {
          fill-opacity: 0;
        }
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
import { IronswornSettings } from '../../../helpers/settings.js'

const props = defineProps<{
  current: keyof typeof RANKS
}>()

const pipStyle = computed(() =>
  IronswornSettings.theme === 'starforged' ? 'hex' : 'circle'
)

const ranks = Object.keys(RANKS)

/**
 * Tests whether the client's version includes a tooltip API.
 */
const versionHasTooltips = computed(
  () => !!(game as { tooltip?: unknown }).tooltip
)

defineEmits(['click'])
</script>
