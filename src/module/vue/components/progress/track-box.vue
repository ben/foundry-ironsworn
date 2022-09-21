<template>
  <div
    class="flexcol track-box"
    :aria-valuenow="ticks"
    :aria-valuetext="`${ticks} ticks`"
  >
    <svg
      class="track-box-marks"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      role="presentational"
    >
      <TransitionGroup name="draw-tick">
        <line
          v-bind="tickProps"
          v-for="(tick, i) in tickRange"
          :key="`tick-${tick}`"
          v-show="props.ticks > i"
          :transform="tickTransforms[i]"
          :class="`tick-${tick}`"
          :data-tick="tick"
        />
      </TransitionGroup>
    </svg>
  </div>
</template>
<style lang="less">
.track-box {
  border: 1px solid;
  align-items: center;
  justify-content: center;
  aspect-ratio: 1;
  border-radius: 3px;
  object-fit: contain;
  box-shadow: 2px 2px 0 currentColor;
  .track-box-marks {
    margin: 5px;
  }
}
.track-box-marks {
  aspect-ratio: 1;
  stroke: currentColor;
  overflow: visible;
  stroke-width: 2px;
}

.progress-tick {
  vector-effect: non-scaling-stroke;
  stroke-linecap: round;
  stroke-dashoffset: 0;
  stroke-dasharray: 50%;
}

// Progress tick draw animation
.draw-tick-enter-active {
  transition: 0.8s stroke-dashoffset, stroke-dasharray;
}
.draw-tick-leave-active {
  transition: 0.8s;
}

.draw-tick-enter-from {
  stroke-dashoffset: -50%;
}

.draw-tick-leave-from {
  opacity: 1;
}
.draw-tick-leave-to {
  opacity: 0;
}
.draw-tick-enter-to {
  stroke-dashoffset: 0;
}
// helper mixin functions
.animateTick(@value,@duration,@delay:0s) {
  .draw-tick-enter-active[data-tick='@{value}'] {
    transition-duration: @duration;
    transition-delay: @delay;
  }
}
.animateBox(@totalDuration:1s; @baseDelay:0s) {
  @tickDuration: (@totalDuration / 4);
  each(1,2,3,4; {
    @tickDelay: (@tickDuration*(@value - 1));
    .animateTick(@value,@tickDuration,@baseDelay+ @tickDelay);
  });
}
.track {
  &[data-rank='1'] {
    // see the Track component
    // Challenge rank troublesome: marks 3 boxes (12 ticks)
    @box1: 1s;
    @box2: 1s;
    @box3: 1s;
    .track-box:nth-child(3n + 1) {
      .animateBox(@box1);
    }
    .track-box:nth-child(3n + 2) {
      .animateBox(@box2, @box1);
    }
    .track-box:nth-child(3n) {
      @d1: (@box1+ @box2);
      .animateBox(@box3,@d1);
    }
    // handles edge cases when
  }
  &[data-rank='2'] {
    // Challenge rank dangerous: marks 2 boxes (8 ticks)
    @box1: 1s;
    @box2: 0.75s;
    .track-box:nth-child(2n + 1) {
      .animateBox(@box1);
    }
    .track-box:nth-child(2n) {
      .animateBox(@box2, @box1);
    }
  }
  &[data-rank='3'] {
    // Challenge rank formidable: marks 1 box (4 ticks).
    .animateBox(1s);
  }
  &[data-rank='4'] {
    // Challenge rank extreme: marks 2 ticks.
    @d1: 0.5s;
    @d2: 0.5s;
    .animateTick(1,@d1);
    .animateTick(2,@d2,@d1);
    .animateTick(3,@d1);
    .animateTick(4,@d2,@d1);
  }
  &[data-rank='5'] {
    // Challenge rank epic: marks 1 tick.
    .draw-tick-enter-active {
      transition-duration: 0.5s;
    }
  }
}
</style>
<script setup lang="ts">
import { range } from 'lodash'
import { computed } from 'vue'

const tickRange = range(1, 5)
const props = defineProps<{ ticks: number }>()

function siblingDelayFactor(tickNumber: number) {
  return Math.max(1 + (tickNumber - props.ticks), 0)
}

const tickTransforms = [
  'rotate(-45, 50, 50)',
  'rotate(45, 50, 50)',
  'rotate(-90, 50, 50)',
  '',
]

const tickProps = computed(() => ({
  x1: '50',
  y1: '100',
  x2: '50',
  y2: '0',
  class: 'progress-tick',
}))
</script>
