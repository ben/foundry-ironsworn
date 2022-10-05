<template>
  <article class="legacy-track flexcol" ref="legacyTrack" :data-legacy="legacy">
    <h4 class="legacy-track-title">
      {{ $t(`IRONSWORN.${capitalize(legacy)}`) }}
    </h4>

    <section class="legacy-track-controls flexrow" data-tooltip-direction="UP">
      <span v-if="overflowLabel" class="nogrow">
        {{ overflowLabel }}
      </span>
      <BtnFaicon
        class="block nogrow"
        v-if="editMode"
        icon="caret-left"
        @click="decrease"
      />
      <BtnFaicon
        class="block nogrow"
        icon="caret-right"
        @click="increase"
        :data-tooltip="markTooltip"
      />
    </section>

    <ProgressTrack
      class="legacy-track-progress"
      :ticks="ticksDisplayed"
      :rank="null"
      :aria-valuemax="undefined"
      :legacyOverflow="ticks >= maxTicks"
      data-tooltip-direction="UP"
    />
    <XpTrack
      @click="setXp"
      :max="xpEarned"
      :marked="xpSpent"
      class="legacy-track-xp"
    />
  </article>
</template>
<style lang="less">
[data-legacy='discoveries'] {
  --ironsworn-color-thematic: var(--ironsworn-color-legacy-discoveries);
}
[data-legacy='bonds'] {
  --ironsworn-color-thematic: var(--ironsworn-color-legacy-bonds);
}
[data-legacy='quests'] {
  --ironsworn-color-thematic: var(--ironsworn-color-legacy-quests);
}

.legacy-track {
  display: grid;
  grid-template-rows: max-content max-content 0.5em max-content;
  grid-template-columns: max-content 1fr;
  .legacy-track-title {
    font-weight: bold;
    letter-spacing: 0.02em;
    grid-row: 1;
    grid-column: 1;
    margin: 0;
    line-height: 2;
  }
  .legacy-track-controls {
    grid-row: 1;
    grid-column: 2;
    align-items: center;
    justify-content: end;
    .icon-button {
      aspect-ratio: 1;
      height: 100%;
    }
  }
  .legacy-track-progress {
    grid-column: 1 / span 2;
    grid-row: 2 / span 2;
    // FIXME this is a bit of a kluge to ensure that the xp pips match up with the boxes, but should be relatively stable with the size of the. ultimately, tho, it'd be better to have this be laid out automatically, probably with display:contents to destructure the track elements
    max-width: @max_track_width;
  }
  @max_progress_box_width: 50px;
  @max_xp_box_width: 15px;
  @progress_box_gap: 4px;
  @max_track_width: (@max_progress_box_width*10 + @progress_box_gap*9);
  .progress-track {
    margin: 0;
    gap: @progress_box_gap;
  }
  .progress-track-box {
    // extra padding to allow comfy overlap with xp pips
    padding-bottom: (@max_xp_box_width * 0.4);
    max-height: unset;
    max-width: @max_progress_box_width;
    gap: @progress_box_gap;
  }
  .legacy-track-xp {
    @xp_border_width: 1px;
    grid-column: 1 / span 2;
    grid-row: 3 / span 2;
    display: grid;
    grid-template-columns: repeat(20, 1fr);
    max-width: @max_track_width;
    width: 100%;
    gap: @progress_box_gap;
    justify-self: center;
    position: relative;
    .xp-box {
      background-color: var(--ironsworn-color-bg);
      margin: 0;
      aspect-ratio: 1;
      border-radius: 3px;
      border-width: @xp_border_width;
      width: 100%;
      max-width: @max_xp_box_width;
      z-index: 1;
      &.hover,
      &.selected {
        background-color: var(--ironsworn-color-thematic);
        z-index: 100;
      }

      &:not(:nth-child(n + 21)) {
        &:nth-child(2n) {
          justify-self: left;
          border-top-left-radius: 0;
          border-bottom-left-radius: 0;
          margin-left: -((@progress_box_gap+ @xp_border_width)/2);
        }
        &:nth-child(2n + 1) {
          justify-self: right;
          border-top-right-radius: 0;
          border-bottom-right-radius: 0;
          margin-right: -((@progress_box_gap+ @xp_border_width)/2);
        }
      }
      &:nth-child(n + 21) {
        grid-column: span 2;
        justify-self: center;
      }
    }
  }
}
</style>
<script setup lang="ts">
import { computed, inject, Ref } from 'vue'
import { $ActorKey, ActorKey } from '../provisions'
import BtnFaicon from './buttons/btn-faicon.vue'
import { capitalize } from 'lodash'
import { IronswornActor } from '../../actor/actor.js'
import XpTrack from './xp-track.vue'
import _ from 'lodash'
import ProgressTrack from './progress/progress-track.vue'
import {
  CharacterDataProperties,
  CharacterDataSource,
} from '../../actor/actortypes.js'
import {
  ActorData,
  ActorDataBaseProperties,
} from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/actorData.js'

// TODO: make this use an enum from dataforged instead, once rsek gets around to adding it
type LegacyType = 'quests' | 'bonds' | 'discoveries'

// TODO: switch to Dataforged consts when available thru DF2
const maxBoxes = 10
const maxScore = maxBoxes
const ticksPerBox = 4
const maxTicks = maxBoxes * ticksPerBox
const minTicks = 0
const xpEarnedPerBox = 2
const xpEarnedPerOverflowBox = 1

const props = defineProps<{
  /**
   * The legacy track type.
   */
  legacy: LegacyType
}>()

const $actor = inject($ActorKey)
const actor = inject(ActorKey) as Ref<
  ReturnType<typeof IronswornActor.prototype.toObject> &
    CharacterDataSource &
    ActorData
>

const ticks = computed(
  () => actor.value.data.legacies?.[props.legacy] ?? minTicks
)
const ticksDisplayed = computed(() => ticks.value % maxTicks)

const score = computed(() =>
  _.clamp(Math.floor(ticks.value / ticksPerBox), 0, maxScore)
)

const xpEarned = computed(() => {
  const fullRateXp = score.value * xpEarnedPerBox
  if (ticks.value > maxTicks) {
    const overflowTicks = ticks.value - maxTicks
    const overflowBoxes = Math.floor(overflowTicks / ticksPerBox)
    const overflowXp = overflowBoxes * xpEarnedPerOverflowBox
    return fullRateXp + overflowXp
  }
  return fullRateXp
})

const xpSpent = computed(
  () => actor.value.data?.legacies[`${props.legacy}XpSpent`] ?? 0
)

const markTooltip = computed(() => {
  let legacy = game.i18n.localize(`IRONSWORN.${capitalize(props.legacy)}`)
  let amount = game.i18n.localize(`IRONSWORN.PROGRESS.TICK.1`)
  return game.i18n.format(`IRONSWORN.MarkLegacy`, { amount, legacy })
})

const editMode = computed(
  () =>
    (actor.value.flags as Record<string, any>)['foundry-ironsworn']?.[
      'edit-mode'
    ]
)

const overflowLabel = computed(() => {
  const n = Math.floor(ticks.value / maxTicks) * 10
  if (n > 0) {
    return `(+${n})`
  }
  return undefined
})

function setXp(newValue: number) {
  $actor?.update({
    [`data.legacies.${props.legacy}XpSpent`]: newValue,
  })
}

function adjustTrack(inc) {
  const current = actor.value.data?.legacies[props.legacy] ?? 0
  $actor?.update({
    [`data.legacies.${props.legacy}`]: current + inc,
  })
}
function increase() {
  adjustTrack(1)
}
function decrease() {
  adjustTrack(-1)
}
</script>
