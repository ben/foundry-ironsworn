<template>
  <div class="flexcol">
    <header class="sheet-header nogrow">
      <document-img :document="actor" style="margin: 5px" />
      <document-name :document="actor" />
    </header>

    <div v-if="foe">
      <div class="flexrow nogrow">
        <rank-hexes
          :current="foe.data.rank"
          @click="setRank"
          class="nogrow"
          style="margin-right: 1em"
        />
        <h4>{{ rankText }}</h4>
        <btn-faicon class="block nogrow" icon="trash" @click="clearProgress" />
        <btn-faicon
          class="block nogrow"
          icon="caret-right"
          @click="markProgress"
        />
      </div>

      <!-- PROGRESS -->
      <div class="flexrow track nogrow" style="margin-bottom: 1em">
        <progress-track :ticks="foe.data.current" />
      </div>

      <hr class="nogrow" />

      <!-- DESCRIPTION -->
      <div v-html="foe.data.description" />
    </div>

    <div
      v-else
      class="flexcol ironsworn__drop__target"
      data-drop-type="progress"
      style="text-align: center; justify-items: space-around"
    >
      <btn-faicon @click="addEmpty" class="block" icon="file">
        {{ $t('IRONSWORN.Progress') }}</btn-faicon
      >
      <btn-compendium class="block" compendium="ironswornfoes"
        >{{ $t('IRONSWORN.Foes') }} (Ironsworn)</btn-compendium
      >
      <btn-compendium class="block" compendium="starforgedencounters"
        >{{ $t('IRONSWORN.Foes') }} (Starforged)</btn-compendium
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
import DocumentImg from './document-img.vue'
import DocumentName from './document-name.vue'
import RankHexes from './rank-hexes/rank-hexes.vue'
import BtnFaicon from './buttons/btn-faicon.vue'
import ProgressTrack from './progress/progress-track.vue'
import BtnCompendium from './buttons/btn-compendium.vue'

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
  return game.i18n.localize(CONFIG.IRONSWORN.Ranks[props.actor.data.rank])
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
  const increment = CONFIG.IRONSWORN.RankIncrements[foe.value?.data.rank]
  const newValue = Math.min(foe.value?.data.current + increment, 40)
  foundryFoe.value.update({ 'data.current': newValue })
  foe.value.data.current = newValue
}
</script>
