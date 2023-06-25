<template>
	<article
		:tabindex="0"
		class="progress-track"
		:class="{
			['compact-progress']: compactProgress
		}"
		role="slider"
		:aria-label="$t('IRONSWORN.ITEM.TypeProgressTrack')"
		aria-orientation="horizontal"
		:data-rank="rank"
		:data-ticks="ticks"
		:data-score="score"
		:aria-valuenow="ticks"
		:aria-valuemin="ProgressModel.TICKS_MIN"
		:aria-valuemax="ProgressModel.TICKS_MAX"
		:aria-valuetext="$t('IRONSWORN.PROGRESS.Current', { score, ticks })"
		:data-tooltip="$t('IRONSWORN.PROGRESS.Current', { score, ticks })">
		<ProgressTrackBox
			v-for="(boxTicks, i) in boxes"
			:key="`progress-box-${i + 1}`"
			tabindex="-1"
			role="presentational"
			:ticks="boxTicks ?? ProgressModel.TICKS_MIN"
			:is-overflow-box="legacyOverflow" />
	</article>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { fill } from 'lodash-es'
import ProgressTrackBox from './progress-track-box.vue'
import { ProgressModel } from '../../../item/subtypes/progress'
import type { ChallengeRank } from '../../../fields/ChallengeRank'

const props = defineProps<{
	/**
	 * The number of ticks marked on this track.
	 */
	ticks: number
	/**
	 * Use 'null' if it's an unranked track, such as a Legacy or classic Bonds.
	 */
	rank: ChallengeRank.Value | null
	legacyOverflow?: boolean
	/**
	 * When true, renders the progress bar for more compact display.
	 */
	compactProgress?: boolean
}>()

const score = computed(() =>
	Math.clamped(
		Math.floor(props.ticks / ProgressModel.TICKS_PER_BOX),
		ProgressModel.SCORE_MIN,
		ProgressModel.SCORE_MAX
	)
)

const visibleTicks = computed(() =>
	props.ticks > ProgressModel.TICKS_MAX
		? props.ticks % ProgressModel.TICKS_MAX
		: props.ticks
)

const boxes = computed(() => {
	const boxTicks = Array<number>(ProgressModel.BOXES)
	const filledBoxes = Math.floor(
		visibleTicks.value / ProgressModel.TICKS_PER_BOX
	)
	const ticksRemainder = visibleTicks.value % ProgressModel.TICKS_PER_BOX

	fill(boxTicks, ProgressModel.TICKS_PER_BOX, 0, filledBoxes)
	if (ticksRemainder > 0) {
		boxTicks[filledBoxes] = ticksRemainder
	}
	return boxTicks
})
</script>

<style lang="scss">
@use 'mixin:clickable.scss';

.progress-track {
	--ironsworn-progress-box-border-radius: var(--ironsworn-border-radius-md);
	--ironsworn-progress-box-border-width: var(--ironsworn-border-width-md);

	// TODO: replace this with a 4px variable when available
	--ironsworn-progress-box-gap: 4px;
	--ironsworn-progress-box-max-size: 50px;

	display: grid;
	grid-template-columns: repeat(10, 1fr);
	grid-auto-flow: column;
	gap: var(--ironsworn-progress-box-gap);
	align-items: center;
	justify-content: center;

	&:focus {
		@include clickable.focusOutline;
	}

	.progress-track-box {
		border-radius: var(--ironsworn-progress-box-border-radius);
		max-width: var(--ironsworn-progress-box-max-size);
		max-height: var(--ironsworn-progress-box-max-size);
	}

	&.compact-progress {
		--ironsworn-progress-box-gap: 0;

		display: flex;
		flex-flow: row nowrap;

		.progress-track-box {
			flex-basis: 10%;
			margin: 0;
			border: var(--ironsworn-progress-box-border-width) solid currentcolor;
			border-radius: 0;

			&:first-child {
				border-radius: var(--ironsworn-progress-box-border-radius) 0 0
					var(--ironsworn-progress-box-border-radius);
			}

			&:not(:first-child) {
				margin-left: calc(var(--ironsworn-progress-box-border-width) / -2);
			}

			&:last-child {
				border-radius: 0 var(--ironsworn-progress-box-border-radius)
					var(--ironsworn-progress-box-border-radius) 0;
			}

			&:not(:last-child) {
				margin-right: calc(var(--ironsworn-progress-box-border-width) / -2);
			}

			.progress-tick {
				// sets absolute width so compact progress doesn't totally disappear when displayed in the compact format
				vector-effect: non-scaling-stroke;
				stroke-width: var(--ironsworn-border-width-md);
			}
		}
	}
}
</style>
