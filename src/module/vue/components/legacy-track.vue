<template>
  <article class="legacy-track flexcol" :data-legacy="legacy">
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

    <Track
      class="legacy-track-progress"
      :ticks="displayedTicks"
      rank="epic"
      :legacyOverflow="ticks >= 40"
      data-tooltip-direction="UP"
    />

    <LegacyXpCounters class="legacy-track-xp" :legacy="legacy" :actor="actor" />
  </article>
</template>
<style lang="less">
[data-legacy='discoveries'] {
  --ironsworn-thematic-color: var(--ironsworn-color-legacy-discoveries);
}
[data-legacy='bonds'] {
  --ironsworn-thematic-color: var(--ironsworn-color-legacy-bonds);
}
[data-legacy='quests'] {
  --ironsworn-thematic-color: var(--ironsworn-color-legacy-quests);
}
.legacy-track {
  display: grid;
  grid-template-rows: max-content max-content 0.5em 0.5em;
  .legacy-track-title {
    grid-row: 1;
    grid-column: 1;
  }
  .legacy-track-controls {
    grid-row: 1;
    grid-column: 2;
    align-items: center;
    justify-content: end;
  }
  .legacy-track-progress {
    grid-column: 1 / span 2;
    grid-row: 2 / span 2;
  }
  .legacy-track-xp {
    grid-column: 1 / span 2;
    grid-row: 3 / span 2;
  }
  .track-box {
    padding-bottom: 0.45em;
  }
}
</style>
<style lang="less" scoped>
h4 {
  margin: 0.5rem 0;
}
</style>

<script setup lang="ts">
import { computed, inject, provide, Ref } from 'vue'
import { $ActorKey } from '../../provisions'
import LegacyXpCounters from './legacy-xp-counters.vue'
import Track from '../progress/track.vue'
import BtnFaicon from '../buttons/btn-faicon.vue'
import { capitalize } from 'lodash'
import { IronswornActor } from '../../../actor/actor.js'
import { RANKS } from '../../../constants.js'

const props = defineProps<{
  actor: IronswornActor
  /**
   * The legacy track type.
   */
  legacy: 'quests' | 'bonds' | 'discoveries'
}>()

const $actor = inject($ActorKey)
provide(
  'actor',
  computed(() => props.actor)
)

const markTooltip = computed(() => {
  let legacy = game.i18n.localize(`IRONSWORN.${capitalize(props.legacy)}`)
  let amount = game.i18n.localize(`IRONSWORN.PROGRESS.TICK.1`)
  return game.i18n.format(`IRONSWORN.MarkLegacy`, { amount, legacy })
})

const editMode = computed(
  () => props.actor.flags?.['foundry-ironsworn']?.['edit-mode']
)
const ticks = computed(() => {
  return props.actor.data.legacies?.[props.legacy] ?? 0
})
const displayedTicks = computed(() => ticks.value % 40)

const effectiveProgressScore = computed(() =>
  ticks.value > 40 ? 10 : Math.floor(ticks.value / 40)
)

const overflowLabel = computed(() => {
  const n = Math.floor(ticks.value / 40) * 10
  if (n > 0) {
    return `(+${n})`
  }
  return undefined
})

function adjust(inc) {
  const current = props.actor.data?.legacies[props.legacy] ?? 0
  $actor?.update({
    [`data.legacies.${props.legacy}`]: current + inc,
  })
}
function increase() {
  adjust(1)
}
function decrease() {
  adjust(-1)
}
</script>
