<template>
  <div class="flexcol nogrow">
    <div class="flexrow">
      <h4>{{ $t('IRONSWORN.Bonds') }}</h4>
      <IronBtn block class="nogrow" @click="editBonds">
        <template #icon><FontIcon name="pen-to-square" /></template>
      </IronBtn>
      <IronBtn block class="nogrow" @click="rollBonds">
        <template #icon><IronIcon name="d10-tilt" /></template>
      </IronBtn>
    </div>
    <ProgressTrack
      :ticks="bondcount"
      :rank="null"
      :compact-progress="props.compactProgress"
    />
  </div>
</template>

<script setup lang="ts">
import { ActorDataBaseSource } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/actorData.js'
import { inject, computed, Ref } from 'vue'
import {
  BondsetDataPropertiesData,
  BondsetDataSource,
} from '../../item/itemtypes.js'
import { $ActorKey, ActorKey } from '../provisions'
import IronBtn from './buttons/IronBtn.vue'
import FontIcon from './icon/font-icon.vue'
import IronIcon from './icon/iron-icon.vue'
import ProgressTrack from './progress/progress-track.vue'

const props = defineProps<{ compactProgress?: boolean }>()

const actor = inject(ActorKey)
const $actor = inject($ActorKey)

const bonds = computed(() => {
  return actor?.value?.items.find(
    (x) => x.type === 'bondset'
  ) as unknown as ActorDataBaseSource & BondsetDataSource
})
const bondcount = computed(() => {
  const sys = (bonds.value as any)?.system as
    | BondsetDataPropertiesData
    | undefined
  if (!sys?.bonds) return 0
  return Object.values(sys.bonds).length
})

function editBonds() {
  const item = $actor?.items.get(bonds?.value?._id as string)
  item?.sheet?.render(true)
}
function rollBonds() {
  const item = $actor?.items.get(bonds?.value?._id as string)
  item?.writeEpilogue()
}
</script>
