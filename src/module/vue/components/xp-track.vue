<template>
  <article class="xp-track" :class="$style.xpTrack">
    <button
      v-for="(box, i) in computedBoxes"
      :class="{
        [$style.xpBox]: true,
        [boxClass ?? '']: !!boxClass,
      }"
      type="button"
      :key="box.key"
      :data-segment="box.segmentState"
      @mouseover="hovered = i"
      @mouseleave="hovered = -1"
      @click="click(i)"
    />
  </article>
</template>
<style lang="less" module>
@import '../../../styles/clickable.less';
@import '../../../styles/mixins.less';

@progress_box_gap: var(--ironsworn-spacer-md);
@xp_border_width: var(--ironsworn-border-width-md);
@xp_box_spacer: calc((@progress_box_gap + @xp_border_width) * -0.5);

.xpTrack {
  display: grid;
  grid-template-columns: repeat(20, 1fr);
  position: relative;
}
.xpBox {
  --xp-box-max-size: v-bind('maxSize');
  max-width: var(--xp-box-max-size);
  .blockMixin(@xp_border_width,var(--xp-box-max-size));
  margin: 0;
  border-style: solid;
  border-width: @xp_border_width;
  width: 100%;
  max-width: var(--xp-box-max-size);
  position: relative;
  aspect-ratio: 1;
  border-radius: var(--ironsworn-border-radius-md);
  z-index: auto;
  &:not(:nth-child(n + 21)) {
    &:nth-child(2n) {
      justify-self: left;
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
      margin-left: @xp_box_spacer;
    }
    &:nth-child(2n + 1) {
      justify-self: right;
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
      margin-right: @xp_box_spacer;
    }
  }
  &:nth-child(n + 21) {
    grid-column: span 2;
    justify-self: center;
  }
  &[data-segment='hovered'] {
    .blockHoverMixin(calc(var(--xp-box-max-size)*2));
  }
  &[data-segment='filled'] {
    .blockActiveMixin();
  }
}
</style>
<script lang="ts" setup>
import { computed, ref } from 'vue'

/**
 * A Starforged-style XP track for use with legacy tracks.
 */
const props = withDefaults(
  defineProps<{
    max: number
    marked: number
    maxSize?: string
    boxClass?: string
  }>(),
  { maxSize: '15px' }
)

const hovered = ref(-1)

interface Box {
  key: string
  segmentState: 'hovered' | 'filled' | 'empty'
}

const computedBoxes = computed(() => {
  const ret = [] as Box[]
  for (let i = 0; i < props.max; i++) {
    ret.push({
      key: `box${i}`,
      segmentState: computeState(i, hovered.value, props.marked),
    })
  }
  return ret
})

function computeState(
  index: number,
  hoveredValue: number,
  markedValue: number
): Box['segmentState'] {
  if (hoveredValue === -1) {
    if (markedValue >= index + 1) {
      return 'filled'
    }
  }
  if (hoveredValue >= index) {
    return 'hovered'
  }
  return 'empty'
}

const $emit = defineEmits<{ (e: 'click', value: number): void }>()
function click(i) {
  if (i === 0 && props.marked === 1) {
    i = -1
  }
  $emit('click', i + 1)
}
</script>
