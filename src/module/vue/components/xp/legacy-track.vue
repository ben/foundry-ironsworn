<template>
  <article
    class="legacy-track flexcol"
    :class="{ 'legacy-overflow': overflow }"
  >
    <h4 class="legacy-track-title">{{ title }}</h4>

    <section class="legacy-track-controls flexrow">
      <span
        v-if="overflow"
        class="nogrow"
        style="padding: 1px; margin-right: 10px"
      >
        {{ overflow }}
      </span>
      <BtnFaicon
        class="block nogrow"
        v-if="editMode"
        icon="caret-left"
        @click="decrease"
      />
      <BtnFaicon class="block nogrow" icon="caret-right" @click="increase" />
    </section>

    <Track class="legacy-track-progress" :ticks="displayTicks" />

    <XpTrackLegacy
      class="nogrow"
      :max="xpBoxCount"
      :marked="xpSpent"
      @click="setXp"
    />
  </article>
</template>
<style lang="less">
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
  .xp-track-legacy {
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
import { computed, inject, Ref } from 'vue'
import { $ActorKey } from '../../provisions'
import XpTrackLegacy from './xp-track-legacy.vue'
import Track from '../progress/track.vue'
import BtnFaicon from '../buttons/btn-faicon.vue'

const props = defineProps<{ propKey: string; title: string }>()

const actor = inject('actor') as Ref
const $actor = inject($ActorKey)

const editMode = computed(() => {
  return actor.value.flags['foundry-ironsworn']?.['edit-mode']
})

const ticks = computed(() => {
  return actor.value.data.legacies[props.propKey] ?? 0
})
const displayTicks = computed(() => ticks.value % 40)

const xpBoxCount = computed(() => {
  // 2 for each box up until 10, then 1 for each box afterwards
  const fullBoxes = Math.floor(ticks.value / 4)
  if (fullBoxes <= 10) {
    return fullBoxes * 2
  } else {
    return fullBoxes + 10
  }
})
const xpArray = computed(() => {
  const ret = [] as number[]
  for (let i = 1; i <= xpBoxCount.value; i++) {
    ret.push(i)
  }
  return ret
})
const xpSpent = computed(() => {
  return actor.value.data.legacies[`${props.propKey}XpSpent`] ?? 0
})
const overflow = computed(() => {
  const n = Math.floor(ticks.value / 40) * 10
  if (n > 0) {
    return `(+${n})`
  }
  return undefined
})

function adjust(inc) {
  const current = actor.value.data?.legacies[props.propKey] ?? 0
  $actor?.update({
    [`data.legacies.${props.propKey}`]: current + inc,
  })
}
function increase() {
  adjust(1)
}
function decrease() {
  adjust(-1)
}

function setXp(n) {
  $actor?.update({
    data: { legacies: { [`${props.propKey}XpSpent`]: n } },
  })
}
</script>
