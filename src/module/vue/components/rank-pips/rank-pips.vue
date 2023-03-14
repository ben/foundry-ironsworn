<template>
  <article
    class="rank-pips"
    :aria-label="$t('IRONSWORN.ChallengeRank')"
    :aria-valuetext="current"
  >
    <button
      v-for="rank in ranks"
      :key="rank"
      :data-tooltip="$t(`IRONSWORN.CHALLENGERANK.${$capitalize(rank)}`)"
      data-tooltip-direction="UP"
      type="button"
      class="rank-pip nogrow theme-pip"
      :aria-selected="rank === current"
      @click="$emit('click', rank)"
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

<script setup lang="ts">
import { computed } from 'vue'
import { RANKS } from '../../../constants'
import PipSvgHex from './pip-svg-hex.vue'
import PipSvgCircle from './pip-svg-circle.vue'
import { IronswornSettings } from '../../../helpers/settings.js'

const props = defineProps<{
  current: keyof typeof RANKS
}>()

const pipStyle = computed(() =>
  IronswornSettings.get('theme') === 'starforged' ? 'hex' : 'circle'
)

const ranks = Object.keys(RANKS)

defineEmits(['click'])
</script>
