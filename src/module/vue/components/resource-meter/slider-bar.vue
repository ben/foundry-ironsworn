<template>
	<article
		tabindex="0"
		role="slider"
		class="slider-bar"
		:aria-readonly="readOnly"
		:aria-disabled="disabled"
		:aria-valuemin="min"
		:aria-valuemax="max"
		:aria-valuenow="disabled ? 0 : value"
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
		@keydown.end="setSliderValue(max, $event)"
		@keydown.0="setSliderValue(0, $event)"
		@keydown.1="setSliderValue(1, $event)"
		@keydown.2="setSliderValue(2, $event)"
		@keydown.3="setSliderValue(3, $event)"
		@keydown.4="setSliderValue(4, $event)"
		@keydown.5="setSliderValue(5, $event)"
		@keydown.6="setSliderValue(6, $event)"
		@keydown.7="setSliderValue(7, $event)"
		@keydown.8="setSliderValue(8, $event)"
		@keydown.9="setSliderValue(9, $event)">
		<slot name="start"></slot>
		<button
			v-for="segment in sliderSegments"
			:key="segment"
			type="button"
			class="slider-segment clickable block"
			:class="props.segmentClass?.[segment]"
			tabindex="-1"
			:aria-selected="!disabled && segment === value"
			:aria-disabled="!inRange(segment, min, max + 1)"
			@click.capture="setSliderValue(segment, $event)"
			@focus.prevent>
			<span tabindex="-1" class="slider-segment-text">
				{{ segmentLabel(segment) }}
			</span>
		</button>
		<slot name="end"></slot>
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
		/** The highest selectable value on the bar */
		max: number
		/**
		 * The lowest selectable value on the bar
		 * @default 0
		 */
		min?: number | undefined
		/** The maximum value visible on the bar, if it's different from `max` */
		barMax?: number | undefined
		/** The lowest value visible on the bar, if it's different from `min` */
		barMin?: number | undefined
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
		disabled?: boolean
	}>(),
	{
		readOnly: false,
		orientation: 'vertical',
		min: 0,
		barMax: undefined,
		barMin: undefined,
		segmentClass: undefined
	}
)

const $emit = defineEmits<{
	(e: 'change', value: number): void
}>()

const sliderSegments = computed(() =>
	rangeRight(props.min, (props.barMax ?? props.max) + 1)
)

function setSliderValue(newValue: number, event: Event) {
	if (props.readOnly || props.disabled) {
		return
	}
	event.preventDefault()
	$emit('change', Math.clamped(newValue, props.min, props.max))
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
<dd>Set to maximum (${props.max}).</dd>
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
	position: relative;
	flex-wrap: none;
	grid-row: 1;
	border: 0;
	border-radius: var(--ironsworn-slider-segment-border-radius);
	padding: 0;

	&:focus {
		@include clickable.focusOutline;
	}

	.locked & {
		opacity: 0.5;
		background-color: var(--ironsworn-bar-lock-color);
		overflow: clip;
	}

	&[aria-orientation='vertical'] {
		flex-direction: column;
		flex-grow: 0;

		.slider-segment {
			flex: 0 0 auto;
			width: var(--ironsworn-slider-segment-vertical-width);

			&:not(:first-of-type) {
				margin-block-start: calc(
					-1 * var(--ironsworn-slider-segment-border-width)
				);
			}

			&:first-of-type {
				border-start-start-radius: var(
					--ironsworn-slider-segment-border-radius
				);
				border-start-end-radius: var(--ironsworn-slider-segment-border-radius);
			}

			&:last-of-type {
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

			&:not(:first-of-type) {
				margin-inline-start: calc(
					-1 * var(--ironsworn-slider-segment-border-width)
				);
			}

			&:first-of-type {
				border-top-left-radius: var(--ironsworn-slider-segment-border-radius);
				border-bottom-left-radius: var(
					--ironsworn-slider-segment-border-radius
				);
			}

			&:last-of-type {
				border-top-right-radius: var(--ironsworn-slider-segment-border-radius);
				border-bottom-right-radius: var(
					--ironsworn-slider-segment-border-radius
				);
			}
		}
	}

	&[aria-disabled='true'],
	&[aria-readonly='true'],
	&[readonly] {
		pointer-events: none !important;

		.slider-segment {
			pointer-events: none !important;
		}
	}
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
</style>
