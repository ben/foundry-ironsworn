<template>
  <article
    tabindex="0"
    role="slider"
    class="slider-bar"
    :class="{
      flexcol: orientation == 'vertical',
      flexrow: orientation == 'horizontal',
    }"
    :aria-readonly="readonly"
    :aria-valuemin="props.min"
    :aria-valuemax="currentMax"
    :aria-valuenow="currentValue"
    :aria-orientation="orientation"
    @keydown.arrow-up.prevent="setCurrent(currentValue + 1)"
    @keydown.+.prevent="setCurrent(currentValue + 1)"
    @keydown.arrow-left.prevent="setCurrent(currentValue + 1)"
    @keydown.page-up.prevent="setCurrent(2)"
    @keydown.-.prevent="setCurrent(currentValue - 1)"
    @keydown.arrow-down.prevent="setCurrent(currentValue - 1)"
    @keydown.arrow-right.prevent="setCurrent(currentValue - 1)"
    @keydown.page-down.prevent="setCurrent(-2)"
    @keydown.home.prevent="setCurrent(min)"
    @keydown.end.prevent="setCurrent(currentMax)"
    @keydown.0.prevent="setCurrent(0)"
    @keydown.1.prevent="setCurrent(1)"
    @keydown.2.prevent="setCurrent(2)"
    @keydown.3.prevent="setCurrent(3)"
    @keydown.4.prevent="setCurrent(4)"
    @keydown.5.prevent="setCurrent(5)"
    @keydown.6.prevent="setCurrent(6)"
    @keydown.7.prevent="setCurrent(7)"
    @keydown.8.prevent="setCurrent(8)"
    @keydown.9.prevent="setCurrent(9)"
  >
    <button
      v-for="segment in sliderSegments"
      :key="segment"
      type="button"
      class="clickable block slider-segment"
      :class="props.segmentClass?.[segment]"
      tabindex="-1"
      :aria-selected="segment === currentValue"
      :aria-disabled="!inRange(segment, props.min, currentMax + 1)"
      @click.capture="setCurrent(segment)"
      @focus.prevent
    >
      <span tabindex="-1" class="slider-segment-text">
        {{ segmentLabel(segment) }}
      </span>
    </button>
  </article>
</template>

<style lang="less">
@segment_border_width: 1px;
@segment_border_radius: 5px;
@segment_line_height: 28px;
@segment_vertical_width: 50px;

.slider-bar {
  flex-wrap: none;
  border-radius: @segment_border_radius; // so the focus effect aligns properly
  grid-row: 1;
  border: 0;
  padding: 0;
  &:focus {
    outline: 0;
    box-shadow: 0 0 6px var(--color-shadow-primary);
  }
  .slider-bar-segment {
    box-sizing: border-box;
    border: @segment_border_width solid currentColor;
    text-align: center;
    min-width: max-content;
    line-height: @segment_line_height;
    position: relative;
    z-index: 1;
    padding: 0;
    &:hover,
    &[aria-selected='true'] {
      z-index: 10; // with position: relative, ensures that hovered item borders/filters aren't rendered behind other items
    }
  }
  &[aria-orientation='vertical'] {
    flex-grow: 0;
    .slider-bar-segment {
      flex: 0 0 auto;
      width: @segment_vertical_width;
      &:not(:first-child) {
        margin-block-start: -@segment_border_width;
      }
      &:first-child {
        border-start-start-radius: @segment_border_radius;
        border-start-end-radius: @segment_border_radius;
      }
      &:last-child {
        border-end-start-radius: @segment_border_radius;
        border-end-end-radius: @segment_border_radius;
      }
    }
  }
  &[aria-orientation='horizontal'] {
    flex: 1;
    flex-wrap: nowrap;
    .slider-bar-segment {
      &:not(:first-child) {
        margin-inline-start: -@segment_border_width;
      }
      &:first-child {
        border-top-left-radius: @segment_border_radius;
        border-bottom-left-radius: @segment_border_radius;
      }
      &:last-child {
        border-top-right-radius: @segment_border_radius;
        border-bottom-right-radius: @segment_border_radius;
      }
    }
  }
  &[aria-readonly] {
    pointer-events: none !important;
  }
}
</style>

<script lang="ts" setup>
/**
 * A bar that functions as a number slider.
 */
import { clamp, inRange, min, range, rangeRight } from 'lodash'
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    readonly?: boolean
    currentValue: number
    /**
     * @default 0
     */
    min?: number | undefined
    max: number
    softMax?: number | undefined
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
    segmentClass?: Record<number, any>
  }>(),
  {
    orientation: 'vertical',
    min: 0,
  }
)

const $emit = defineEmits<{
  (e: 'change', value: number): void
}>()

const sliderSegments = computed(() => rangeRight(props.min, props.max + 1))

const currentMax = computed(() =>
  Math.min(props.softMax ?? props.max, props.max)
)

function setCurrent(newValue: number) {
  $emit('change', clamp(newValue, props.min, currentMax.value))
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
</script>
