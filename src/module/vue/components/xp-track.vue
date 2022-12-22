<template>
  <article class="flexrow xp-track nogrow">
    <button
      class="xp-box"
      type="button"
      v-for="(box, i) in computedBoxes"
      :key="box.key"
      :data-segment-state="box.state"
      :aria-selected="i == marked"
      @mouseover="hovered = i"
      @mouseleave="hovered = -1"
      @click="click(i)"
    />
  </article>
</template>
<style lang="scss" scoped>
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
      @include mixins.overlay(var(--ironsworn-z-index-high));
      @include mixins.tint(var(--ironsworn-color-thematic), 0);

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

const hovered = ref(-1)

type BoxState = 'hovered' | 'selected' | 'inactive'
interface Box {
  key: string
  state: BoxState
}

const computedBoxes = computed(() => {
  const ret = [] as Box[]
  const activeHover = hovered.value > -1
  for (let i = 0; i < props.max; i++) {
    let state: BoxState
    switch (true) {
      case !activeHover && props.marked >= i:
        state = 'selected'
        break
      case hovered.value >= i:
        state = 'hovered'
        break
      default:
        state = 'inactive'
        break
    }
    ret.push({
      key: `box${i}`,
      state,
    })
  }
  return ret
})

const $emit = defineEmits<{ (e: 'click', value: number): void }>()
function click(i) {
  if (i === 0 && props.marked === 1) {
    i = -1
  }
  $emit('click', i + 1)
}
</script>
