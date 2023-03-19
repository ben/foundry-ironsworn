<template>
	<article
		class="rank-pips"
		:aria-label="$t('IRONSWORN.ChallengeRank')"
		:aria-valuetext="localizeRank(current)">
		<button
			v-for="rank in 5"
			:key="rank"
			:data-tooltip="localizeRank(rank)"
			data-tooltip-direction="UP"
			type="button"
			class="rank-pip nogrow theme-pip"
			:aria-selected="rank === current"
			@click="$emit('click', rank)">
			<PipSvgCircle
				v-if="pipStyle === 'circle'"
				role="presentational"
				class="svg pip-shape" />
			<PipSvgHex
				v-if="pipStyle === 'hex'"
				role="presentational"
				class="svg pip-shape" />
		</button>
	</article>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import PipSvgHex from './pip-svg-hex.vue'
import PipSvgCircle from './pip-svg-circle.vue'
import { IronswornSettings } from '../../../helpers/settings.js'
import type { ChallengeRank } from '../../../constants'
import { localizeRank } from '../../../helpers/util'

defineProps<{
	current: ChallengeRank
}>()

const pipStyle = computed(() =>
	IronswornSettings.get('theme') === 'starforged' ? 'hex' : 'circle'
)

defineEmits(['click'])
</script>
