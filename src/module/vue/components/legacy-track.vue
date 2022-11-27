<template>
  <article
    class="flexcol"
    :class="$style.legacyTrack"
    ref="legacyTrack"
    :data-legacy="legacy"
  >
    <h4 :class="$style.title">
      {{ $t(`IRONSWORN.${capitalize(legacy)}`) }}
    </h4>

    <section
      class="flexrow"
      :class="$style.trackControls"
      data-tooltip-direction="UP"
    >
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
      :class="$style.progressTrack"
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
      class="flexrow nogrow"
      :class="$style.legacyTrackXp"
      :boxClass="$style.xpBox"
    />
  </article>
</template>
<style lang="less" module>
@import '../../../styles/clickable.less';
@import '../../../styles/mixins.less';
@xp_border_width: var(--ironsworn-border-width-md);

@max_progress_box_width: 50px;
@progress_box_gap: var(--ironsworn-spacer-md);
@max_track_width: calc(@max_progress_box_width*10 + @progress_box_gap*9);

.legacyTrack {
  display: grid;
  grid-template-rows: max-content max-content 0.5em max-content;
  grid-template-columns: max-content 1fr;
  .thematicHoverMixin(v-bind('getThematicColor'));
}

.title {
  font-weight: bold;
  letter-spacing: 0.02em;
  grid-row: 1;
  grid-column: 1;
  margin: 0;
  line-height: 2;
}

.trackControls {
  grid-row: 1;
  grid-column: 2;
  align-items: center;
  justify-content: end;
  // .icon-button {
  //   aspect-ratio: 1;
  //   height: 100%;
  // }
}

.progressTrack {
  grid-column: 1 / span 2;
  grid-row: 2 / span 2;
  margin: 0;
  gap: @progress_box_gap;
  // FIXME this is a bit of a kluge to ensure that the xp pips match up with the boxes, but should be relatively stable with the size of the. ultimately, tho, it'd be better to have this be laid out automatically, probably with display:contents to destructure the track elements
  max-width: @max_track_width;

  & > * {
    // progress track boxes
    // extra padding to allow comfy overlap with xp pips
    max-height: unset;
    max-width: @max_progress_box_width;
    padding-bottom: var(--ironsworn-spacer-sm);
    gap: @progress_box_gap;
  }
}

.legacyTrackXp {
  margin-top: var(--ironsworn-spacer-sm);
  grid-column: 1 / span 2;
  grid-row: 3 / span 2;
  justify-self: center;
  max-width: @max_track_width;
  width: 100%;
  gap: @progress_box_gap;
}
</style>

<script setup lang="ts">
import { computed, inject, Ref } from 'vue'
import { $ActorKey, ActorKey } from '../provisions'
import BtnFaicon from './buttons/btn-faicon.vue'
import { capitalize } from 'lodash'
import XpTrack from './xp-track.vue'
import _ from 'lodash'
import ProgressTrack from './progress/progress-track.vue'

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
  /**
   * The thematic accent color to use when rendering this track. Defaults to the one associated with the legacy type, so you probably don't need to set it unless you're doing something weird.
   */
  thematicColor?: string
}>()

const getThematicColor = computed(
  () => props.thematicColor ?? `var(--ironsworn-color-legacy-${props.legacy})`
)

const $actor = inject($ActorKey)
const actor = inject(ActorKey) as Ref

const ticks = computed(
  () => actor.value.system.legacies?.[props.legacy] ?? minTicks
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
  () => actor.value.system?.legacies[`${props.legacy}XpSpent`] ?? 0
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
    [`system.legacies.${props.legacy}XpSpent`]: newValue,
  })
}

function adjustTrack(inc) {
  const current = actor.value.system?.legacies[props.legacy] ?? 0
  $actor?.update({
    [`system.legacies.${props.legacy}`]: current + inc,
  })
}
function increase() {
  adjustTrack(1)
}
function decrease() {
  adjustTrack(-1)
}
</script>
