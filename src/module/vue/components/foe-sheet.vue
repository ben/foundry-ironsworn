<template>
  <div class="flexcol">
    <SheetHeaderBasic :document="actor" class="nogrow" />
    <div v-if="foe" class="flexcol">
      <div class="flexrow nogrow" style="margin: 0.5rem 0">
        <RankPips
          :current="foeSystem.rank"
          @click="setRank"
          style="margin-right: 1em"
        />
        <h4 style="margin: 0; line-height: 22px">{{ rankText }}</h4>
        <IronBtn block nogrow icon="fa:trash" @click="clearProgress" />
        <IronBtn block nogrow icon="fa:caret-right" @click="markProgress" />
      </div>

      <!-- PROGRESS -->
      <div class="flexrow track nogrow" style="margin-bottom: 1em">
        <ProgressTrack
          :rank="foeSystem.rank"
          :ticks="foeSystem.current"
          data-tooltip-direction="RIGHT"
        />
      </div>

      <!-- DESCRIPTION -->
      <MceEditor v-model="foeSystem.description" @save="saveDescription" />
    </div>

    <DropTarget
      v-else
      is="div"
      dropType="progress"
      class="flexcol"
      :class="$style.dropTarget"
    >
      <IronBtn
        @click="addEmpty"
        block
        icon="fa:file"
        :text="$t('IRONSWORN.Progress')"
      />
      <BtnCompendium
        block
        compendium="ironswornfoes"
        :text="`${$t('IRONSWORN.Foes')} (Ironsworn)`"
      />
      <BtnCompendium
        block
        compendium="starforgedencounters"
        :text="`${$t('IRONSWORN.Foes')} (Starforged)`"
      />
    </DropTarget>
  </div>
</template>

<style lang="scss" module>
.dropTarget {
  justify-items: space-around;
  text-align: center;

  .clickable.block {
    flex-grow: 0;
    padding: 1rem;
  }
}
</style>

<script setup lang="ts">
import SheetHeaderBasic from '../sheet-header-basic.vue'
import { computed, inject, provide } from 'vue'
import { IronswornActor } from '../../actor/actor'
import { $ActorKey, ActorKey } from '../provisions'
import { throttle } from 'lodash'
import RankPips from './rank-pips/rank-pips.vue'
import IronBtn from './buttons/iron-btn.vue'
import BtnCompendium from './buttons/btn-compendium.vue'
import MceEditor from './mce-editor.vue'
import { RANKS, RANK_INCREMENTS } from '../../constants'
import { ProgressDataPropertiesData } from '../../item/itemtypes'
import { FoeDataProperties } from '../../actor/actortypes'
import ProgressTrack from './progress/progress-track.vue'
import DropTarget from '../drop-target.vue'

const props = defineProps<{
  actor: ReturnType<typeof IronswornActor.prototype.toObject> &
    FoeDataProperties
}>()
provide(ActorKey, computed(() => props.actor) as any)
const foe = computed(() => {
  return props.actor.items.find((x) => x.type === 'progress')
})
const foeSystem = computed(
  () => (foe.value as any)?.system as ProgressDataPropertiesData
)

const $actor = inject($ActorKey)
const foundryFoe = () => $actor?.items.get((foe.value as any)?._id)

const rankText = computed(() => {
  return game.i18n.localize(RANKS[foeSystem.value?.rank])
})

// async foe(newFoe) {
//   const data = { name: newFoe?.name, img: newFoe?.img }
//   await $actor?.update(data)
//   await $actor?.token.update(data)
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
  foundryFoe()?.update({ system: { rank } })
}

function clearProgress() {
  foundryFoe()?.update({ 'system.current': 0 })
}

function markProgress() {
  const increment = RANK_INCREMENTS[foeSystem.value?.rank]
  const newValue = Math.min(foeSystem.value?.current + increment, 40)
  foundryFoe()?.update({ 'system.current': newValue })
}

function saveDescription() {
  foundryFoe()?.update({
    system: { description: foeSystem.value?.description },
  })
}
</script>
