<template>
  <article
    class="legacy-xp-counters continuous-selection"
    :data-legacy="legacy"
    :aria-valuenow="xpSpent"
  >
    <!-- add transition -->
    <!-- consider: show last row bar until there's a tick on the next one -->
    <XpCounter
      v-for="(xpCounter, i) in xpCounters"
      :key="`${legacy}-xp-${xpCounter.xpValue}`"
      :xpValue="xpCounter.xpValue"
      :legacy="legacy"
      :class="{ overflow: xpCounter.overflow }"
      class="legacy-xp-counter continuous-selection-segment"
      :aria-disabled="xpCounter.disabled"
      :disabled="xpCounter.disabled"
      :aria-selected="xpSpent === xpCounter.xpValue"
      @click="setXp(xpCounter.xpValue)"
    />
  </article>
</template>
<style lang="less">
@pill_radius: 2px;
@pill_empty_color: var(--ironsworn-color-bg);

.legacy-xp-counters {
  display: grid;
  grid-auto-flow: column;
  grid-template-columns: repeat(20, 1fr);
  width: 100%;
  gap: 4px;
  .legacy-xp-counter {
    text-align: center;
    position: relative;
    overflow: hidden;
    background-color: var(--ironsworn-thematic-color);
    &.overflow {
      grid-column: span 2;
      border-radius: @pill_radius;
    }
    &:not(.overflow) {
      &:nth-child(2n + 1) {
        border-start-start-radius: @pill_radius;
        border-end-start-radius: @pill_radius;
        justify-self: end;
        border-inline-end-width: 1px;
        margin-inline-end: -2px;
        // border-inline-end-color: @pill_empty_color;
        z-index: 2;
      }
      &:nth-child(2n) {
        border-start-end-radius: @pill_radius;
        border-end-end-radius: @pill_radius;
        justify-self: start;
        margin-inline-start: -2px;
        border-inline-start-width: 0;
        // border-inline-start-color: @pill_empty_color;
        z-index: 1;
      }
    }
  }
}

.pillEmptyMixin() {
  background-color: @pill_empty_color;
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
import { fill, times } from 'lodash'
import { computed, inject, provide } from 'vue'
import { IronswornActor } from '../../../actor/actor.js'
import { $ActorKey } from '../../provisions.js'
import XpCounter from './xp-counter.vue'

// CONSTANTS
const ticksPerBox = 4
const maxProgressBoxes = 10
const maxTicks = ticksPerBox * maxProgressBoxes
const xpPerLegacyBox = 2
const xpOverflowThreshold = maxProgressBoxes * xpPerLegacyBox
const xpPerOverflowBox = 1

const props = defineProps<{
  actor: IronswornActor
  /**
   * The legacy track type.
   */
  legacy: 'quests' | 'bonds' | 'discoveries'
}>()

// INJECTION
const $actor = inject($ActorKey)

provide(
  'actor',
  computed(() => props.actor)
)

// COMPUTED
const legacyTicks = computed(() => {
  return props.actor.data?.legacies[props.legacy] ?? 0
})
const xpSpent = computed(() => {
  return props.actor.data?.legacies[`${props.legacy}XpSpent`] ?? 0
})
const overflowBoxes = computed(() => {
  const overflowTicks = Math.max(0, legacyTicks.value - maxTicks)
  return ticksToFilledBoxes(overflowTicks)
})

const earnedXp = computed(() => {
  const normalBoxes = ticksToFilledBoxes(Math.min(legacyTicks.value, maxTicks))
  console.log('normal boxes', normalBoxes)
  const normalXp = normalBoxes * xpPerLegacyBox
  const overflowXp = overflowBoxes.value * xpPerOverflowBox
  console.log(props.legacy + ' legacy xp', normalXp + overflowXp)
  return normalXp + overflowXp
})

const xpCounters = computed(() => {
  let minCounters = maxProgressBoxes * xpPerLegacyBox
  let overflowRows = Math.floor(overflowBoxes.value / maxProgressBoxes)
  let countersToRender =
    minCounters + overflowRows * maxProgressBoxes * xpPerOverflowBox
  return times(countersToRender, (index) => {
    const xpValue = index + 1
    return {
      disabled: xpValue > earnedXp.value,
      overflow: xpValue > xpOverflowThreshold,
      xpValue,
    }
  })
})

// METHODS

function ticksToFilledBoxes(ticks: number) {
  return Math.floor(ticks / ticksPerBox)
}

function setXp(xpValue: number) {
  let newXp
  if (xpValue === 1 && xpSpent.value === 1) {
    newXp = 0
  } else {
    newXp = xpValue
  }
  $actor?.update({
    data: { legacies: { [`${props.legacy}XpSpent`]: newXp } },
  })
}

// TYPES
interface XpCounter {
  disabled: boolean
  overflow: boolean
  xpValue: number
}
</script>
