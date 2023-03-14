<template>
  <div class="flexcol nogrow">
    <div class="flexrow">
      <h4>{{ $t('IRONSWORN.ITEMS.TypeBond') }}</h4>
      <IronBtn block nogrow icon="fa:pen-to-square" @click="editBonds" />
      <IronBtn block nogrow icon="ironsworn:d10-tilt" @click="rollBonds" />
    </div>
    <ProgressTrack
      :ticks="bondcount"
      :rank="null"
      :compact-progress="props.compactProgress"
    />
  </div>
</template>

<script setup lang="ts">
import type { ActorDataBaseSource } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/actorData.js'
import { inject, computed, Ref } from 'vue'
import type {
  BondsetDataPropertiesData,
  BondsetDataSource,
} from '../../item/itemtypes.js'
import { $ActorKey, ActorKey } from '../provisions'
import IronBtn from './buttons/iron-btn.vue'
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

<style lang="less" scoped>
h4 {
  text-transform: uppercase;
}
</style>
