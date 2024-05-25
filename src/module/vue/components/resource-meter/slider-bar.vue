<template>
	<article
		tabindex="0"
		role="slider"
		class="slider-bar"
		:aria-readonly="props.readOnly"
		:aria-valuemin="props.min"
		:aria-valuemax="currentMax"
		:aria-valuenow="value"
		:aria-orientation="orientation"
		@keydown.arrow-up="setSliderValue(value + 1, $event)"
		@keydown.+="setSliderValue(value + 1, $event)"
		@keydown.arrow-left="setSliderValue(value + 1, $event)"
		@keydown.page-up="setSliderValue(value + 2, $event)"
		@keydown.-="setSliderValue(value - 1, $event)"
		@keydown.arrow-down="setSliderValue(value - 1, $event)"
		@keydown.arrow-right="setSliderValue(value - 1, $event)"
		@keydown.page-down="setSliderValue(value - 2, $event)"
		@keydown.home="setSliderValue(min, $event)"
		@keydown.end="setSliderValue(currentMax, $event)"
		@keydown.0="setSliderValue(0, $event)"
		@keydown.1="setSliderValue(1, $event)"
		@keydown.2="setSliderValue(2, $event)"
		@keydown.3="setSliderValue(3, $event)"
		@keydown.4="setSliderValue(4, $event)"
		@keydown.5="setSliderValue(5, $event)"
		@keydown.6="setSliderValue(6, $event)"
		@keydown.7="setSliderValue(7, $event)"
		@keydown.8="setSliderValue(8, $event)"
		@keydown.9="setSliderValue(9, $event)"
	>
		<button
			v-for="segment in sliderSegments"
			:key="segment"
			type="button"
			class="slider-segment clickable block"
			:class="props.segmentClass?.[segment]"
			tabindex="-1"
			:aria-selected="segment === value"
			:aria-disabled="!inRange(segment, props.min, currentMax + 1)"
			@click.capture="setSliderValue(segment, $event)"
			@focus.prevent
		>
			<span tabindex="-1" class="slider-segment-text">
				{{ segmentLabel(segment) }}
			</span>
		</button>
	</article>
</template>

<script lang="ts" setup>
/**
 * A bar that functions as a number slider.
 */
import { inRange, rangeRight } from 'lodash-es'
import { computed } from 'vue'

const props = withDefaults(
	defineProps<{
		readOnly?: boolean
		/** The current value of the bar. */
		value: number
		/**
		 * @default 0
		 */
		min?: number | undefined
		max: number
		softMax?: number | null
		/**
		 * @default "vertical"
		 */
		orientation?: 'vertical' | 'horizontal'
		/**
		 * Classes to assign to segments, keyed by the segment's value.
		 * @example
		 * ```typescript
		 * // Assign the 'momentum-reset' class to the segment with the value of the variable 'reset'
		 * {[reset]: 'momentum-reset'}
		 * ```
		 */
		segmentClass?: Record<number, any> | undefined
	}>(),
	{
		readOnly: false,
		orientation: 'vertical',
		min: 0,
		softMax: null,
		segmentClass: undefined
	}
)

const $emit = defineEmits<{
	change: [number]
}>()

const sliderSegments = computed(() => rangeRight(props.min, props.max + 1))

const currentMax = computed(() =>
	Math.min(props.softMax ?? props.max, props.max)
)

function setSliderValue(newValue: number, event: Event) {
	if (props.readOnly) {
		return
	}
	event.preventDefault()
	$emit('change', Math.clamp(newValue, props.min, currentMax.value))
}

/**
 * Generates a label string for a slider segment.
 * If the slider's range includes both positive and negative values, positive values are prefixed with a '+'.
 * @param value The value to generate a label for.
 */
function segmentLabel(value: number) {
	if (props.min < 0 && value > 0) {
		return `+${value}`
	}
	return value.toString()
}

// TODO: wire this up with a tooltip configuration that isn't annoying to mouse users
const keybindInfo = computed(
	() => `<dl>
<dt><kbd>Enter</kbd></dt>
<dd>Burn your momentum and reset it to ${props.min}.</dd>
<dt><kbd>+</kbd></dt>
<dt><kbd>UpArrow</kbd></dt>
<dt><kbd>RightArrow</kbd></dt>
<dd>Increase by 1.</dd>
<dt><kbd>-</kbd></dt>
<dt><kbd>DownArrow</kbd></dt>
<dt><kbd>LeftArrow</kbd></dt>
<dd>Decrease by 1.</dd>
<dt><kbd>Home</kbd></dt>
<dd>Set to maximum (${currentMax.value}).</dd>
<dt><kbd>End</kbd></dt>
<dd>Set to minimum (${props.min}).</dd>
<dt><kbd>0-9</kbd></dt>
<dd>Set to a specific value.</dd>
</dl>
`
)
</script>

<style lang="scss" scoped>
@use 'mixin:clickable.scss';

.slider-bar {
	--ironsworn-slider-segment-border-width: var(--ironsworn-border-width-md);
	--ironsworn-slider-segment-border-radius: var(--ironsworn-border-radius-lg);
	--ironsworn-slider-segment-line-height: var(--ironsworn-line-height-lg);
	--ironsworn-slider-segment-vertical-width: var(
		--ironsworn-vertical-slider-width
	);

	display: flex;
	flex-wrap: none;
	grid-row: 1;
	border: 0;
	border-radius: var(--ironsworn-slider-segment-border-radius);
	padding: 0;

	&:focus {
		@include clickable.focusOutline;
	}

	.slider-segment {
		box-sizing: border-box;
		position: relative;
		z-index: 1;
		border: var(--ironsworn-slider-segment-border-width) solid currentcolor;
		border-radius: 0;
		padding: 0;
		min-width: max-content;
		text-align: center;
		line-height: var(--ironsworn-slider-segment-line-height);

		&:hover,
		&[aria-selected='true'] {
			// with position: relative, ensures that hovered item borders/filters aren't rendered behind other items
			z-index: 10;
		}
	}

	&[aria-orientation='vertical'] {
		flex-direction: column;
		flex-grow: 0;

		.slider-segment {
			flex: 0 0 auto;
			width: var(--ironsworn-slider-segment-vertical-width);

			&:not(:first-child) {
				margin-block-start: calc(
					-1 * var(--ironsworn-slider-segment-border-width)
				);
			}

			&:first-child {
				border-start-start-radius: var(
					--ironsworn-slider-segment-border-radius
				);
				border-start-end-radius: var(--ironsworn-slider-segment-border-radius);
			}

			&:last-child {
				border-end-start-radius: var(--ironsworn-slider-segment-border-radius);
				border-end-end-radius: var(--ironsworn-slider-segment-border-radius);
			}
		}
	}

	&[aria-orientation='horizontal'] {
		flex: 1;
		flex-flow: row nowrap;

		.slider-segment {
			flex-grow: 1;

			&:not(:first-child) {
				margin-inline-start: calc(
					-1 * var(--ironsworn-slider-segment-border-width)
				);
			}

			&:first-child {
				border-top-left-radius: var(--ironsworn-slider-segment-border-radius);
				border-bottom-left-radius: var(
					--ironsworn-slider-segment-border-radius
				);
			}

			&:last-child {
				border-top-right-radius: var(--ironsworn-slider-segment-border-radius);
				border-bottom-right-radius: var(
					--ironsworn-slider-segment-border-radius
				);
			}
		}
	}

	&[aria-readonly='true'],
	&[readonly] {
		pointer-events: none !important;

		.slider-segment {
			pointer-events: none !important;
		}
	}
}
</style>
