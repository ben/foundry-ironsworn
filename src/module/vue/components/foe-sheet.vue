<template>
  <div class="flexcol">
    <SheetHeaderBasic :document="actor" class="nogrow" />
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
        <ProgressTrack
          :rank="foe?.data.rank"
          :ticks="foe.data.current"
          data-tooltip-direction="RIGHT"
        />
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
import SheetHeaderBasic from '../sheet-header-basic.vue'
import { computed, inject, provide } from 'vue'
import { IronswornActor } from '../../actor/actor'
import { $ActorKey, ActorKey } from '../provisions'
import { throttle } from 'lodash'
import RankPips from './rank-pips/rank-pips.vue'
import BtnFaicon from './buttons/btn-faicon.vue'
import BtnCompendium from './buttons/btn-compendium.vue'
import MceEditor from './mce-editor.vue'
import { RANKS, RANK_INCREMENTS } from '../../constants'
import { ProgressDataProperties } from '../../item/itemtypes'
import { FoeDataProperties } from '../../actor/actortypes'
import Track from './progress/track.vue'
import ProgressTrack from './progress/progress-track.vue'

const props = defineProps<{
  actor: ReturnType<typeof IronswornActor.prototype.toObject> &
    FoeDataProperties
}>()
provide(ActorKey, computed(() => props.actor) as any)
const foe = props.actor.items.find(
  (x) => x.type === 'progress'
) as ProgressDataProperties

const $actor = inject($ActorKey)
const foundryFoe = $actor?.items.get((foe as any)?._id)

const rankText = computed(() => {
  return game.i18n.localize(RANKS[foe?.data.rank])
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
  foundryFoe?.update({ data: { rank } })
  foe!.data.rank = rank
}

function clearProgress() {
  foundryFoe?.update({ 'data.current': 0 })
  foe.data.current = 0
}

function markProgress() {
  const increment = RANK_INCREMENTS[foe?.data.rank]
  const newValue = Math.min(foe?.data.current + increment, 40)
  foundryFoe?.update({ 'data.current': newValue })
  foe.data.current = newValue
}

function saveDescription() {
  foundryFoe?.update({
    data: { description: foe?.data.description },
  })
}
const throttledSaveDescription = throttle(saveDescription, 1000)
</script>
