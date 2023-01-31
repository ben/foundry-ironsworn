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
        <IronBtn
          v-if="multipleUsers"
          block
          nogrow
          :icon="whisperIcon"
          @click="toggleWhisper"
          :data-tooltip="whisperTooltip"
        />
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
        v-if="multipleUsers"
        block
        nogrow
        :icon="whisperIcon"
        @click="toggleWhisper"
        :data-tooltip="whisperTooltip"
        :text="$t('IRONSWORN.ChatAlert.ToggleMute')"
      />
      <IronBtn
        @click="addEmpty"
        block
        nogrow
        icon="fa:file"
        :text="$t('IRONSWORN.ITEM.TypeProgressTrack')"
      />
      <BtnCompendium
        block
        nogrow
        compendium="ironswornfoes"
        :text="`${$t('IRONSWORN.Foes')} (Ironsworn)`"
      />
      <BtnCompendium
        block
        nogrow
        compendium="starforgedencounters"
        :text="`${$t('IRONSWORN.Foes')} (Starforged)`"
      />
    </DropTarget>
  </div>
</template>

<style lang="less" module>
.dropTarget {
  justify-items: space-around;
  text-align: center;

  button {
    padding: 1rem;
  }
}
</style>

<script setup lang="ts">
import SheetHeaderBasic from '../sheet-header-basic.vue'
import { computed, inject, provide } from 'vue'
import { IronswornActor } from '../../actor/actor'
import { $ActorKey, ActorKey } from '../provisions'
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

function setRank(rank) {
  foundryFoe()?.update({ system: { rank } })
}

function clearProgress() {
  foundryFoe()?.update({ 'system.current': 0 })
}

const multipleUsers = (game.users?.contents?.length ?? 0) > 1

const whisperIcon = computed(() =>
  (props.actor.flags['foundry-ironsworn'] as any)?.['muteBroadcast']
    ? 'fa:volume-xmark'
    : 'fa:volume'
)

const whisperTooltip = computed(() =>
  (props.actor.flags['foundry-ironsworn'] as any)?.['muteBroadcast']
    ? 'IRONSWORN.ChatAlert.Muted'
    : 'IRONSWORN.ChatAlert.Unmuted'
)

function toggleWhisper() {
  const current = $actor?.getFlag('foundry-ironsworn', 'muteBroadcast') ?? false
  return $actor?.setFlag('foundry-ironsworn', 'muteBroadcast', !current)
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
