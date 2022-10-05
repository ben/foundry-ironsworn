<template>
  <div
    tabindex="0"
    class="spinner-bar nowrap"
    :class="{
      flexcol: orientation == 'vertical',
      flexrow: orientation == 'horizontal',
    }"
    role="spinbutton"
    :aria-valuemin="props.min"
    :aria-valuemax="currentMax"
    :aria-valuenow="state.value"
    :aria-orientation="orientation"
    @keydown.arrow-up="stepUp"
    @keydown.+="stepUp"
    @keydown.arrow-right="stepUp"
    @keydown.page-up="increment(2)"
    @keydown.-="stepDown"
    @keydown.arrow-down="stepDown"
    @keydown.arrow-left="stepDown"
    @keydown.page-down="increment(-2)"
    @keydown.home="setCurrent(min)"
    @keydown.end="setCurrent(currentMax)"
    @keydown.0="setCurrent(0)"
    @keydown.1="setCurrent(1)"
    @keydown.2="setCurrent(2)"
    @keydown.3="setCurrent(3)"
    @keydown.4="setCurrent(4)"
    @keydown.5="setCurrent(5)"
    @keydown.6="setCurrent(6)"
    @keydown.7="setCurrent(7)"
    @keydown.8="setCurrent(8)"
    @keydown.9="setCurrent(9)"
  >
    <button
      v-for="x in spinnerValues"
      :key="x"
      type="button"
      class="clickable block spinner-bar-segment"
      :class="props.segmentClass?.[x]"
      tabindex="-1"
      :ref="`spinnerBarSegment_${x}`"
      :aria-selected="x === state.value"
      :aria-disabled="!inRange(x, props.min, currentMax + 1)"
      @click.prevent.self="setCurrent(x)"
    >
      <span tabindex="-1" class="spinner-bar-segment-text">
        {{ segmentLabel(x) }}
      </span>
    </button>
  </div>
</template>

<style lang="less">
@segment_border_width: 1px;
@segment_border_radius: 5px;
@segment_line_height: 28px;

.spinner-bar {
  border-radius: @segment_border_radius; // so the focus effect aligns properly
  grid-row: 1;
  border: 0;
  padding: 0;
  &:focus {
    outline: 0;
    box-shadow: 0 0 6px var(--color-shadow-primary);
  }
  .spinner-bar-segment {
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
    .spinner-bar-segment {
      flex: 0 0 auto;
      width: 50px;
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
    .spinner-bar-segment {
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
}
</style>

<script lang="ts" setup>
/**
 * A bar that functions as a number spinner.
 */
import { clamp, inRange, min, rangeRight } from 'lodash'
import { computed, CSSProperties, reactive } from 'vue'

const props = withDefaults(
  defineProps<{
    initialValue: number
    /**
     * @default 0
     */
    min: number
    max: number
    /**
     * @default 1
     */
    step?: number | undefined
    softMax?: number | undefined
    /**
     * @default "vertical"
     */
    orientation?: 'vertical' | 'horizontal'
    /**
     * Classes to assign to segments, keyed by the segment's value.
     * @example
     * ```typescript
     * // Assign the 'momentum-reset' class to the segment with the value of 'reset'
     * {[reset]: 'momentum-reset'}
     * ```
     */
    segmentClass?: Record<number, any>
  }>(),
  {
    orientation: 'vertical',
    step: 1,
  }
)

const state = reactive({
  value: props.initialValue,
})

const emits = defineEmits<{
  (e: 'input', value: number): void
  (e: 'change', value: number): void
}>()

const spinnerValues = computed(() => rangeRight(props.min, props.max + 1))

const currentMax = computed(() =>
  props.softMax ? Math.min(props.softMax, props.max) : props.max
)

function isValidValue(value: number) {
  if (inRange(value, props.min, currentMax.value)) {
    return true
  }
  return false
}

function clampedValue(value: number) {
  return clamp(value, props.min, currentMax.value)
}

function increment(delta: number) {
  const newValue = clampedValue(state.value + delta)
  if (newValue !== state.value) {
    state.value = newValue
    emits('change', state.value)
  }
}

function stepDown() {
  console.log('stepdown')
  increment(-props.step)
}

function stepUp() {
  console.log('stepUp')
  increment(props.step)
}

function setCurrent(newValue: number) {
  console.log('setCurrent', newValue)
  if (isValidValue(newValue)) {
    state.value = clampedValue(newValue)
    emits('change', state.value)
  }
}

/**
 * Generates a label string for a spinner segment.
 * If the spinner's range includes both positive and negative values, positive values are prefixed with a '+'.
 * @param value The value to generate a label for.
 */
function segmentLabel(value: number) {
  if (props.min < 0 && value > 0) {
    return `+${value}`
  }
  return value.toString()
}

// const keybindData = computed(() => {
//   const arr: {
//     keys: (number | string)[]
//     description: string
//     fn: (event: KeyboardEvent) => void
//   }[] = [
//     { keys: ['ArrowUp', '+'], description: 'Increase by 1.', fn: stepUp },
//     { keys: ['ArrowDown', '-'], description: 'Decrease by 1.', fn: stepDown },
//     {
//       keys: ['Home'],
//       description: `Set to maximum (${currentMax.value}).`,
//       fn: () => (state.current = currentMax.value),
//     },
//     {
//       keys: ['End'],
//       description: `Set to minimum (${props.min}).`,
//       fn: () => (state.current = props.min),
//     },
//   ]

//   spinnerValues.value
//     // filters for values that exist on typical keyboards, 0-9
//     .filter((v) => inRange(v, 0, 10))
//     .forEach((value) => {
//       arr.push({
//         keys: [value],
//         description: 'Set to a specific value.',
//         fn: () => setCurrent(value),
//       })
//     })
//   return arr
// })

// const keydownDirective = computed(() => {
//   const obj: Record<string | number, (...args) => void> = {}
//   keybindData.value.forEach((keyData) => {
//     keyData.keys.forEach((k) => {
//       let key: string | number
//       if (typeof k === 'string' && k.match(/[A-z]/)) {
//         key = kebabCase(k)
//       } else {
//         key = k
//       }
//       obj[key] = keyData.fn
//     })
//   })
//   return obj
// })

// console.log('keydownDirective', keydownDirective.value)
// TODO: figure out a way to localize this that isn't totally silly
// might be better handled by a component of its own, TBH, as the composition is fairly complex
// TODO: this needs to be computed or something.
</script>
