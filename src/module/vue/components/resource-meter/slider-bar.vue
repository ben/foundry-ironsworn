<template>
  <article
    tabindex="0"
    role="slider"
    class="slider-bar"
    :aria-readonly="props.readOnly"
    :aria-valuemin="props.min"
    :aria-valuemax="currentMax"
    :aria-valuenow="currentValue"
    :aria-orientation="orientation"
    @keydown.arrow-up="setSliderValue(currentValue + 1, $event)"
    @keydown.+="setSliderValue(currentValue + 1, $event)"
    @keydown.arrow-left="setSliderValue(currentValue + 1, $event)"
    @keydown.page-up="setSliderValue(currentValue + 2, $event)"
    @keydown.-="setSliderValue(currentValue - 1, $event)"
    @keydown.arrow-down="setSliderValue(currentValue - 1, $event)"
    @keydown.arrow-right="setSliderValue(currentValue - 1, $event)"
    @keydown.page-down="setSliderValue(currentValue - 2, $event)"
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
      :aria-selected="segment === currentValue"
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

<style lang="less" scoped>
@segment_border_width: 1px;
@segment_border_radius: 5px;
@segment_line_height: 28px;
@segment_vertical_width: 50px;

.slider-bar {
  display: flex;
  flex-wrap: none;
  border-radius: @segment_border_radius; // so the focus effect aligns properly
  grid-row: 1;
  border: 0;
  padding: 0;
  &:focus {
    outline: 0;
    box-shadow: 0 0 6px var(--color-shadow-primary);
  }
  .slider-segment {
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
    flex-direction: column;
    .slider-segment {
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
    flex-direction: row;
    flex: 1;
    flex-wrap: nowrap;
    .slider-segment {
      flex-grow: 1;
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
  &[aria-readonly='true'] {
    pointer-events: none !important;
    .slider-segment {
      pointer-events: none !important;
    }
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
    readOnly?: boolean
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
    readOnly: false,
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

function setSliderValue(newValue: number, event: Event) {
  if (props.readOnly) {
    return
  }
  event.preventDefault()
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
