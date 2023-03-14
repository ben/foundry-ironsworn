<template>
	<div
		class="flexcol progress-track-box"
		:class="{ 'track-overflow': isOverflowBox }"
		:aria-valuenow="ticks"
		:aria-valuetext="$t('IRONSWORN.PROGRESS.Ticks', { ticks })"
		@transitionstart="onTransitionStart"
		@transitionend="onTransitionEnd">
		<svg
			class="progress-track-box-marks"
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 100 100"
			role="presentational">
			<g v-if="isOverflowBox" class="ghost-ticks">
				<line
					v-for="(tick, i) in tickRange"
					v-bind="tickProps"
					:key="`ghost-tick-${tick}`"
					:transform="tickTransforms[i]"
					class="ghost-tick"
					:data-tick="tick" />
			</g>
			<g>
				<TransitionGroup :name="transitionName">
					<line
						v-for="(tick, i) in tickRange"
						v-show="props.ticks > i"
						v-bind="tickProps"
						:key="`tick-${tick}`"
						:transform="tickTransforms[i]"
						:data-tick="tick" />
				</TransitionGroup>
			</g>
		</svg>
	</div>
</template>
<script setup lang="ts">
import { range } from 'lodash-es'
import { computed } from 'vue'
import { IronswornSettings } from '../../../helpers/settings.js'

const props = defineProps<{
	ticks: number
	/**
	 * Whether to indicate this as an "overflow" progress box by rendering a second set of 4 ticks with low opacity. Used by legacy tracks that have previously been filled to 10.
	 */
	isOverflowBox?: boolean
}>()

const transitionName = computed(() =>
	IronswornSettings.get('progress-mark-animation')
		? 'draw-progress-tick'
		: undefined
)

const tickRange = range(1, 5)

const tickTransforms = [
	'rotate(-45, 50, 50)',
	'rotate(45, 50, 50)',
	'rotate(-90, 50, 50)',
	''
]

const tickProps = computed(() => ({
	x1: '50',
	y1: '100',
	x2: '50',
	y2: '0',
	class: 'progress-tick'
}))

function onTransitionStart(event) {
	// console.log('transitionStart', event)
}
function onTransitionEnd(event) {
	// console.log('transitionEnd', event)
}
</script>
<style lang="scss">
/* stylelint-disable scss/no-dollar-variables */

@use 'sass:math';

// helper mixin functions

@mixin transitionBox($total-duration: 1s, $base-delay: 0s) {
	$tick-duration: math.div($total-duration, 4);
	@each $tick in (1, 2, 3, 4) {
		.progress-tick[data-tick='#{$tick}'] {
			$tick-offset-factor: $tick - 1;
			$tick-delay-offset: $tick-duration * $tick-offset-factor;
			$delay: $base-delay + $tick-delay-offset;

			--ironsworn-tick-draw-delay: #{$delay};
			--ironsworn-tick-draw-duration: #{$tick-duration};
		}
	}
}

.progress-track-box {
	align-items: center;
	justify-content: center;
	border: var(--ironsworn-border-width-md) solid var(--ironsworn-color-border);
	border-radius: var(--ironsworn-border-radius-md);
	aspect-ratio: 1;
	object-fit: contain;
	stroke: var(--ironsworn-color-fg);
	stroke-width: 5;

	&.track-overflow .ghost-ticks {
		// shown to indicate overflow progress on Legacy tracks
		opacity: 0.2;
	}

	.progress-track-box-marks {
		// groups the individual progress ticks
		aspect-ratio: 1;
		margin: 10%;
		overflow: visible;
	}

	.progress-tick {
		--ironsworn-tick-draw-delay: 0s;
		--ironsworn-tick-draw-duration: 0.5s;
		--ironsworn-tick-erase-duration: 0.5s;

		transition: stroke-dashoffset var(--ironsworn-tick-draw-duration)
				var(--ironsworn-tick-draw-delay) ease,
			opacity var(--ironsworn-tick-erase-duration);
		stroke-linecap: round;

		// dash length = stroke length. the draw animation then adjusts the dashoffset
		stroke-dasharray: 100%;
	}
}

// draw animation.
.draw-progress-tick-enter-from {
	stroke-dashoffset: -100%;
}

.draw-progress-tick-enter-to {
	stroke-dashoffset: 0;
}

// erase animation. doesn't bother with draw order - just fades out
.draw-progress-tick-leave-from {
	opacity: 1;
}

.draw-progress-tick-leave-to {
	opacity: 0;
}

.progress-track {
	&[data-rank='1'] {
		// TROUBLESOME challenge rank: marks 3 boxes (12 ticks)
		$box1: 0.75s;
		$box2: 0.75s;
		$box3: 0.75s;

		.progress-track-box:nth-child(3n + 1) {
			@include transitionBox($box1);
		}

		.progress-track-box:nth-child(3n + 2) {
			@include transitionBox($box2, $box1);
		}

		.progress-track-box:nth-child(3n) {
			$d1: ($box1 + $box2);

			@include transitionBox($box3, $d1);
		}

		// offsets the draw delay when the score has a value not divisible by 3, which is rare but technically possible
		&[data-score='1'],
		&[data-score='4'],
		&[data-score='7'] {
			.progress-track-box:nth-child(3n + 2) {
				@include transitionBox($box1);
			}

			.progress-track-box:nth-child(3n) {
				@include transitionBox($box2, $box1);
			}

			.progress-track-box:nth-child(3n + 1) {
				$d1: ($box1 + $box2);

				@include transitionBox($box3, $d1);
			}
		}

		&[data-score='2'],
		&[data-score='5'],
		&[data-score='8'] {
			.progress-track-box:nth-child(3n) {
				@include transitionBox($box1);
			}

			.progress-track-box:nth-child(3n + 1) {
				@include transitionBox($box2, $box1);
			}

			.progress-track-box:nth-child(3n + 2) {
				$d1: ($box1 + $box2);

				@include transitionBox($box3, $d1);
			}
		}
	}

	&[data-rank='2'] {
		// DANGEROUS challenge rank: marks 2 boxes (8 ticks)
		$box1: 1s;
		$box2: 0.75s;

		.progress-track-box:nth-child(2n + 1) {
			@include transitionBox($box1);
		}

		.progress-track-box:nth-child(2n) {
			@include transitionBox($box2, $box1);
		}

		&[data-score='1'],
		&[data-score='3'],
		&[data-score='5'],
		&[data-score='7'],
		&[data-score='9'] {
			// inverts the draw delay when the score has an odd value, which is rare but technically possible
			.progress-track-box:nth-child(2n) {
				@include transitionBox($box1);
			}

			.progress-track-box:nth-child(2n + 1) {
				@include transitionBox($box2, $box1);
			}
		}
	}

	&[data-rank='3'] {
		// FORMIDABLE challenge rank: marks 1 box (4 ticks).
		@include transitionBox(1s);
	}

	&[data-rank='4'] {
		// EXTREME challenge rank: marks 2 ticks at a time.
		.progress-tick {
			// stagger even ticks because they're always drawn second
			&[data-tick='2'],
			&[data-tick='4'] {
				--ironsworn-tick-draw-delay: 0.5s;
			}
		}
	}

	// EPIC challenge rank: marks 1 tick, no add'l styling required.
}
</style>
