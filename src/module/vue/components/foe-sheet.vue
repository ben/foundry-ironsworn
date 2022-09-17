<template>
  <div class="flexcol">
    <header class="sheet-header flexrow nogrow" style="gap: 5px">
      <DocumentImg :document="actor" />
      <DocumentName :document="actor" />
    </header>

    <div v-if="foe">
      <div class="flexrow nogrow">
        <RankPips
          :current="foe.data.rank"
          @click="setRank"
          style="margin-right: 1em"
        />
        <h4>{{ rankText }}</h4>
        <BtnFaicon class="block nogrow" icon="trash" @click="clearProgress" />
        <BtnFaicon
          class="block nogrow"
          icon="caret-right"
          @click="markProgress"
        />
      </div>

      <!-- PROGRESS -->
      <div class="flexrow track nogrow" style="margin-bottom: 1em">
        <ProgressTrack :ticks="foe.data.current" />
      </div>

      <hr class="nogrow" />

      <!-- DESCRIPTION -->
      <MceEditor
        v-model="foe.data.description"
        @save="saveDescription"
        @change="throttledSaveDescription"
      />
      <!-- <div v-html="foe.data.description" /> -->
    </div>

    <div
      v-else
      class="flexcol ironsworn__drop__target"
      data-drop-type="progress"
      style="text-align: center; justify-items: space-around"
    >
      <BtnFaicon @click="addEmpty" class="block" icon="file">
        {{ $t('IRONSWORN.Progress') }}</BtnFaicon
      >
      <BtnCompendium class="block" compendium="ironswornfoes"
        >{{ $t('IRONSWORN.Foes') }} (Ironsworn)</BtnCompendium
      >
      <BtnCompendium class="block" compendium="starforgedencounters"
        >{{ $t('IRONSWORN.Foes') }} (Starforged)</BtnCompendium
      >
    </div>
  </div>
</template>

<style lang="less" scoped>
.ironsworn__drop__target .clickable.block {
  padding: 1rem;
  flex-grow: 0;
}
</style>

<script setup lang="ts">
import { computed, inject, provide } from 'vue'
import { IronswornActor } from '../../actor/actor'
import { $ActorKey } from '../provisions'
import { throttle } from 'lodash'
import DocumentImg from './document-img.vue'
import DocumentName from './document-name.vue'
import RankPips from './rank-pips/rank-pips.vue'
import BtnFaicon from './buttons/btn-faicon.vue'
import ProgressTrack from './progress/progress-track.vue'
import BtnCompendium from './buttons/btn-compendium.vue'
import MceEditor from './mce-editor.vue'
import { RANKS, RANK_INCREMENTS } from '../../constants'

const props = defineProps<{
  actor: ReturnType<typeof IronswornActor.prototype.toObject>
}>()
provide(
  'actor',
  computed(() => props.actor)
)

const $actor = inject($ActorKey)

const foe = computed(() => {
  return props.actor.items.find((x) => x.type === 'progress')
})
const foundryFoe = computed(() => {
  return $actor?.items.get(foe.value._id)
})
const rankText = computed(() => {
  return game.i18n.localize(RANKS[props.actor.data.rank])
})

// async foe(newFoe) {
//   const data = { name: newFoe?.name, img: newFoe?.img }
//   await $actor?.update(data)
//   await $actor?.data.token.update(data)
// },

function addEmpty() {
  Item.create(
    { name: 'NPC', type: 'progress', data: { subtype: 'foe' } },
    { parent: $actor }
  )
}

function openCompendium(name) {
  const pack = game.packs?.get(`foundry-ironsworn.${name}`)
  pack?.render(true)
}

function setRank(rank) {
  foundryFoe.value?.update({ data: { rank } })
  foe.value.data.rank = rank
}

function clearProgress() {
  foundryFoe.value?.update({ 'data.current': 0 })
  foe.value.data.current = 0
}

function markProgress() {
  const increment = RANK_INCREMENTS[foe.value?.data.rank]
  const newValue = Math.min(foe.value?.data.current + increment, 40)
  foundryFoe.value.update({ 'data.current': newValue })
  foe.value.data.current = newValue
}

function saveDescription() {
  foundryFoe.value?.update({
    data: { description: foe.value?.data.description },
  })
}
const throttledSaveDescription = throttle(saveDescription, 1000)
</script>
