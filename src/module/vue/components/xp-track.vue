<template>
  <article
    class="flexrow xp-track nogrow"
    :aria-valuenow="marked"
    aria-valuemin="0"
    :aria-valuemax="max"
  >
    <button
      class="xp-box"
      type="button"
      v-for="box in computedBoxes"
      :key="box.key"
      :value="box.value"
      :data-segment-state="box.state"
      :aria-selected="box.value == marked"
      @mouseover="hovered = box.value"
      @mouseleave="hovered = 0"
      @click="click(box.value)"
    />
  </article>
</template>
<style lang="scss" scoped>
@use 'mixins:fx';

.xp-track {
  position: relative;

  .xp-box {
    // for sizing/layout concerns, see legacy-track.vue

    position: relative;
    z-index: auto;
    border-style: solid;
    border-radius: var(--ironsworn-border-radius-md);
    background-color: var(--ironsworn-color-bg);
    overflow: clip;
    aspect-ratio: 1;

    &::after {
      @include fx.overlay(var(--ironsworn-z-index-high));
      @include fx.tint(var(--ironsworn-color-thematic), 0);

      transition: var(--ironsworn-transition);
      background-blend-mode: normal;
    }

    &[data-segment-state='hovered'] {
      z-index: var(--ironsworn-z-index-high);
      border-color: var(--ironsworn-color-clickable-block-border-hover);
      box-shadow: none;

      &::after {
        opacity: 0.5;
      }
    }

    &[data-segment-state='selected'],
    &:hover[data-segment-state='hovered'] {
      // selected boxes, plus the box currently being hovered when previewing.
      z-index: var(--ironsworn-z-index-high);
      border-color: var(--ironsworn-color-clickable-block-border-selected);

      &::after {
        opacity: 1;
      }
    }
  }
}
</style>
<script lang="ts" setup>
import { computed, ref } from 'vue'

const props = defineProps<{
  max: number
  marked: number
}>()

const hovered = ref(0)

type BoxState = 'hovered' | 'selected' | 'inactive'
interface Box {
  key: string
  state: BoxState
  value: number
}

const computedBoxes = computed(() => {
  const ret = [] as Box[]
  const activeHover = hovered.value > 0
  for (let xpValue = 1; xpValue <= props.max; xpValue++) {
    let state: BoxState
    switch (true) {
      case !activeHover && props.marked >= xpValue:
        state = 'selected'
        break
      case hovered.value >= xpValue:
        state = 'hovered'
        break
      default:
        state = 'inactive'
        break
    }
    ret.push({
      key: `box${xpValue}`,
      state,
      value: xpValue,
    })
  }
  return ret
})

const $emit = defineEmits<{ (e: 'click', value: number): void }>()
function click(xpValue) {
  if (xpValue === 1 && props.marked === 1) {
    xpValue = 0
  }
  $emit('click', xpValue)
}
</script>
