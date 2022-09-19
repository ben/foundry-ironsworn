<template>
  <article
    class="xp-track-legacy continuous-selection"
    :aria-valuenow="props.marked"
  >
    <button
      type="button"
      class="xp-box-legacy continuous-selection-segment"
      v-for="(box, i) in computedBoxes"
      :key="i"
      :aria-disabled="box.disabled"
      :aria-selected="props.marked === i + 1"
      @click="click(i)"
    />
  </article>
</template>
<style lang="less">
@pill_radius: 3px;
@pill_size: 1em;
@pill_fill_color: currentColor;
@pill_empty_color: black;

.xp-track-legacy {
  display: grid;
  grid-auto-flow: column;
  grid-template-columns: repeat(1fr, 20);
  gap: 4px;
  .xp-box-legacy {
    box-sizing: border-box;
    aspect-ratio: 1;
    height: @pill_size;
    flex-grow: 0;
    border: 1px solid;
    text-align: center;
    background-color: @pill_fill_color;
    position: relative;
    transition: var(--std-animation);
    &:nth-child(2n + 1) {
      border-start-start-radius: @pill_radius;
      border-end-start-radius: @pill_radius;
      justify-self: end;
      border-inline-end-width: 1px;
      margin-inline-end: -2px;
      border-inline-end-color: @pill_empty_color;
      z-index: 2;
    }
    &:nth-child(2n) {
      border-start-end-radius: @pill_radius;
      border-end-end-radius: @pill_radius;
      justify-self: start;
      margin-inline-start: -2px;
      border-inline-start-width: 0;
      border-inline-start-color: @pill_empty_color;
      z-index: 1;
    }
  }
}

.pillEmptyMixin() {
  background-color: @pill_empty_color;
  &:nth-child(2n + 1) {
    border-inline-end-color: @pill_fill_color;
  }
  &:nth-child(2n) {
    border-inline-start-color: @pill_fill_color;
  }
}

.continuous-selection {
  pointer-events: none;
  // bg = "selected" color
  .continuous-selection-segment {
    pointer-events: fill;
    &[aria-disabled='true'] {
      pointer-events: none !important;
    }
  }
  &:hover {
    .continuous-selection-segment {
      // bg = "preview" color
      &:hover {
        ~ .continuous-selection-segment {
          .pillEmptyMixin();
        }
      }
    }
  }
  &:not(:hover) {
    .continuous-selection-segment {
      &[aria-selected='true'] {
        ~ .continuous-selection-segment {
          .pillEmptyMixin();
          background-color: @pill_empty_color !important;
        }
      }
    }
    &[aria-valuenow='0'] {
      .continuous-selection-segment {
        .pillEmptyMixin();
        background-color: @pill_empty_color !important;
      }
    }
  }
}
</style>

<script lang="ts" setup>
import { times } from 'lodash'
import { computed, ref } from 'vue'

const props = defineProps<{
  max: number
  marked: number
}>()

const hovered = ref(-1)

const maxBoxes = 20

const computedBoxes = computed(() => {
  const boxes = [] as { disabled: boolean }[]
  for (let i = 0; i < props.max; i++) {
    boxes.push({
      disabled: false,
    })
  }
  return boxes.concat(
    times(maxBoxes - boxes.length, () => ({ disabled: true }))
  )
})

const $emit = defineEmits<{ (e: 'click', value: number): void }>()
function click(i) {
  if (i === 0 && props.marked === 1) {
    i = -1
  }
  $emit('click', i + 1)
}
</script>
