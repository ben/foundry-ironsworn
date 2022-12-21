<template>
  <div
    class="flexcol progress-track-box"
    :class="{ 'track-overflow': isOverflowBox }"
    :aria-valuenow="ticks"
    :aria-valuetext="$t('IRONSWORN.PROGRESS.Ticks', { ticks })"
    @transitionstart="onTransitionStart"
    @transitionend="onTransitionEnd"
  >
    <svg
      class="progress-track-box-marks"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      role="presentational"
    >
      <g class="ghost-ticks" v-if="isOverflowBox">
        <line
          v-bind="tickProps"
          v-for="(tick, i) in tickRange"
          :key="`ghost-tick-${tick}`"
          :transform="tickTransforms[i]"
          class="ghost-tick"
          :data-tick="tick"
        />
      </g>
      <g>
        <TransitionGroup :name="transitionName">
          <line
            v-bind="tickProps"
            v-for="(tick, i) in tickRange"
            :key="`tick-${tick}`"
            v-show="props.ticks > i"
            :transform="tickTransforms[i]"
            :data-tick="tick"
          />
        </TransitionGroup>
      </g>
    </svg>
  </div>
</template>
<style lang="scss">
@use 'sass:math';
/* stylelint-disable no-descending-specificity */

// helper mixin functions
@mixin animate-tick($value, $duration, $delay: 0s) {
  .draw-progress-tick-enter-active[data-tick='#{$value}'] {
    transition-delay: $delay;
    transition-duration: $duration;
  }
}

@mixin animate-box($total-duration: 1s, $base-delay: 0s) {
  $tick-duration: math.div($total-duration, 4);
  $ticks: 1, 2, 3, 4;
  @each $value in $ticks {
    $tick-delay: ($tick-duration * ($value - 1));
    @include animate-tick($value, $tick-duration, $base-delay + $tick-delay);
  }
}

.progress-track-box {
  align-items: center;
  justify-content: center;
  border: var(--ironsworn-border-width-md) solid var(--ironsworn-color-border);
  border-radius: var(--ironsworn-border-radius-md);
  aspect-ratio: 1;
  object-fit: contain;
  stroke: var(--ironsworn-color-fg);
  stroke-width: 5;

  &.track-overflow .ghost-ticks {
    opacity: 0.2;
  }

  .progress-track-box-marks {
    aspect-ratio: 1;
    margin: 10%;
    overflow: visible;
  }

  .progress-tick {
    stroke-dasharray: 100%;
    stroke-dashoffset: 0;
    stroke-linecap: round;
  }
}

// Progress tick draw animation
.draw-progress-tick-enter-active {
  transition: 0.8s stroke-dashoffset, stroke-dasharray;
}

.draw-progress-tick-leave-active {
  transition: 0.8s;
}

.draw-progress-tick-enter-from {
  stroke-dashoffset: -100%;
}

.draw-progress-tick-leave-from {
  opacity: 1;
}

.draw-progress-tick-leave-to {
  opacity: 0;
}

.draw-progress-tick-enter-to {
  stroke-dashoffset: 0;
}

.progress-track {
  &[data-rank='1'] {
    // see the Track component
    // Challenge rank troublesome: marks 3 boxes (12 ticks)
    $box1: 0.75s;
    $box2: 0.75s;
    $box3: 0.75s;

    .progress-track-box:nth-child(3n + 1) {
      @include animate-box($box1);
    }

    .progress-track-box:nth-child(3n + 2) {
      @include animate-box($box2, $box1);
    }

    .progress-track-box:nth-child(3n) {
      $d1: ($box1 + $box2);

      @include animate-box($box3, $d1);
    }

    // offsets the draw delay when the score has a value not divisible by 3, which is rare but technically possible
    &[data-score='1'],
    &[data-score='4'],
    &[data-score='7'] {
      .progress-track-box:nth-child(3n + 2) {
        @include animate-box($box1);
      }

      .progress-track-box:nth-child(3n) {
        @include animate-box($box2, $box1);
      }

      .progress-track-box:nth-child(3n + 1) {
        $d1: ($box1 + $box2);

        @include animate-box($box3, $d1);
      }
    }

    &[data-score='2'],
    &[data-score='5'],
    &[data-score='8'] {
      .progress-track-box:nth-child(3n) {
        @include animate-box($box1);
      }

      .progress-track-box:nth-child(3n + 1) {
        @include animate-box($box2, $box1);
      }

      .progress-track-box:nth-child(3n + 2) {
        $d1: ($box1 + $box2);

        @include animate-box($box3, $d1);
      }
    }
  }

  &[data-rank='2'] {
    // Challenge rank dangerous: marks 2 boxes (8 ticks)
    $box1: 1s;
    $box2: 0.75s;

    .progress-track-box:nth-child(2n + 1) {
      @include animate-box($box1);
    }

    .progress-track-box:nth-child(2n) {
      @include animate-box($box2, $box1);
    }

    &[data-score='1'],
    &[data-score='3'],
    &[data-score='5'],
    &[data-score='7'],
    &[data-score='9'] {
      // inverts the draw delay when the score has an odd value, which is rare but technically possible
      .progress-track-box:nth-child(2n) {
        @include animate-box($box1);
      }

      .progress-track-box:nth-child(2n + 1) {
        @include animate-box($box2, $box1);
      }
    }
  }

  &[data-rank='3'] {
    // Challenge rank formidable: marks 1 box (4 ticks).
    @include animate-box(1s);
  }

  &[data-rank='4'] {
    // Challenge rank extreme: marks 2 ticks.
    $d1: 0.5s;
    $d2: 0.5s;

    @include animate-tick(1, $d1);
    @include animate-tick(2, $d2, $d1);
    @include animate-tick(3, $d1);
    @include animate-tick(4, $d2, $d1);
  }

  &[data-rank='5'] {
    // Challenge rank epic: marks 1 tick.
    .draw-progress-tick-enter-active {
      transition-duration: 0.5s;
    }
  }
}
</style>
<script setup lang="ts">
import { range } from 'lodash'
import { computed } from 'vue'
import { IronswornSettings } from '../../../helpers/settings.js'

const props = defineProps<{
  ticks: number
  /**
   * Whether to indicate this as an "overflow" progress box by rendering a second set of 4 ticks with low opacity. Used by legacy tracks that have previously been filled to 10.
   */
  isOverflowBox?: boolean
}>()

const transitionName = computed(() =>
  IronswornSettings.get('progress-mark-animation')
    ? 'draw-progress-tick'
    : undefined
)

const tickRange = range(1, 5)

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

function onTransitionStart(event) {
  // console.log('transitionStart', event)
}
function onTransitionEnd(event) {
  // console.log('transitionEnd', event)
}
</script>
