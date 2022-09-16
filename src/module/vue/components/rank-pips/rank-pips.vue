<template>
  <article
    class="rank-pips"
    :aria-label="$t('IRONSWORN.ChallengeRank')"
    :aria-valuetext="current"
  >
    <button
      v-for="r in ranks"
      :key="r.rank"
      @click="$emit('click', r.rank)"
      :title="!versionHasTooltips ? $t(`IRONSWORN.${$capitalize(r.rank)}`) : ''"
      :data-tooltip="$t(`IRONSWORN.${$capitalize(r.rank)}`)"
      data-tooltip-direction="UP"
      type="button"
      class="rank-pip nogrow"
      :aria-selected="r.selected"
    >
      <PipSvgCircle
        v-if="pipStyle === 'circle'"
        role="presentational"
        class="svg clickable"
        fill="currentColor"
        fill-opacity="0"
        stroke="currentColor"
        stroke-width="1"
        vector-effect="non-scaling-stroke"
        height="20px"
      />
      <PipSvgHex
        v-if="pipStyle === 'hex'"
        role="presentational"
        class="svg clickable"
        fill="currentColor"
        fill-opacity="0"
        stroke="currentColor"
        stroke-width="1"
        vector-effect="non-scaling-stroke"
        :hex-height="20"
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
}
button.rank-pip {
  padding: 0;
  height: max-content;
  width: max-content;
  line-height: 0;
  display: flex;
  &[aria-selected='true'] {
    ~ svg {
    }
  }
  &:hover {
    ~ svg {
    }
  }
}
</style>

<script setup lang="ts">
import { computed } from '@vue/runtime-core'
import { RANKS } from '../../../constants'
import PipSvgHex from './pip-svg-hex.vue'
import PipSvgCircle from './pip-svg-circle.vue'

const props = defineProps<{
  current: keyof typeof RANKS
  pipStyle: 'hex' | 'circle'
}>()

const ranks = computed(() => {
  const keys = Object.keys(RANKS)
  const position = keys.indexOf(props.current)
  return keys.map((r) => {
    const rankIndex = keys.indexOf(r)
    const selected = rankIndex <= position
    return {
      rank: r,
      selected,
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
