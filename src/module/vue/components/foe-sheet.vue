<template>
  <div class="flexcol">
    <SheetHeaderBasic :document="data.actor" class="nogrow" />
    <ProgressItemDetail v-if="foe" :item="foe" />

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

<style lang="scss" module>
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
import IronBtn from './buttons/iron-btn.vue'
import BtnCompendium from './buttons/btn-compendium.vue'
import { FoeDataProperties } from '../../actor/actortypes'
import DropTarget from '../drop-target.vue'
import ProgressItemDetail from './progress-item-detail.vue'

const props = defineProps<{
  data: {
    actor: ReturnType<typeof IronswornActor.prototype.toObject> &
      FoeDataProperties
  }
}>()
provide(ActorKey, computed(() => props.data.actor) as any)
const foe = computed(() => {
  return props.data.actor.items.find((x) => x.type === 'progress')
})

const $actor = inject($ActorKey)

function addEmpty() {
  Item.create(
    { name: 'NPC', type: 'progress', data: { subtype: 'foe' } },
    { parent: $actor }
  )
}

const multipleUsers = (game.users?.contents?.length ?? 0) > 1
const whisperIcon = computed(() =>
  (props.data.actor.flags['foundry-ironsworn'] as any)?.['muteBroadcast']
    ? 'fa:volume-xmark'
    : 'fa:volume'
)

const whisperTooltip = computed(() =>
  (props.data.actor.flags['foundry-ironsworn'] as any)?.['muteBroadcast']
    ? 'IRONSWORN.ChatAlert.Muted'
    : 'IRONSWORN.ChatAlert.Unmuted'
)

function toggleWhisper() {
  const current = $actor?.getFlag('foundry-ironsworn', 'muteBroadcast') ?? false
  return $actor?.setFlag('foundry-ironsworn', 'muteBroadcast', !current)
}
</script>
