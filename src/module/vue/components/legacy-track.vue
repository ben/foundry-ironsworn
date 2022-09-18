<template>
  <div class="flexcol legacy-track">
    <div class="legacy-track-header flexrow">
      <h4>{{ title }}</h4>
      <p
        v-if="overflow"
        class="nogrow"
        style="padding: 1px; margin-right: 10px"
      >
        {{ overflow }}
      </p>
      <btn-faicon
        class="block nogrow"
        v-if="editMode"
        icon="caret-left"
        @click="decrease"
      />
      <btn-faicon class="block nogrow" icon="caret-right" @click="increase" />
    </div>

    <progress-track :ticks="displayTicks" />

    <xp-track :max="xpBoxCount" :marked="xpSpent" @click="setXp" />
  </div>
</template>

<style lang="less" scoped>
h4 {
  margin: 0.5rem 0;
}
.xp {
  max-height: 40px;
}
.legacy-track-header {
  align-items: center;
}
</style>

<script setup lang="ts">
import { computed, defineComponent, inject, Ref } from 'vue'
import { IronswornActor } from '../../actor/actor'
import { $ActorKey } from '../provisions'
import BtnFaicon from './buttons/btn-faicon.vue'
import XpTrack from './xp-track.vue'
import ProgressTrack from './progress/progress-track.vue'

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
