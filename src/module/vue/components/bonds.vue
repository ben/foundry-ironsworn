<template>
  <div class="flexcol nogrow">
    <div class="flexrow">
      <h4>{{ $t('IRONSWORN.Bonds') }}</h4>
      <btn-faicon class="block nogrow" icon="edit" @click="editBonds" />
      <btn-faicon class="block nogrow" icon="dice-d6" @click="rollBonds" />
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
import { BondsetDataSource } from '../../item/itemtypes.js'
import { $ActorKey, ActorKey } from '../provisions'
import btnFaicon from './buttons/btn-faicon.vue'
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
  if (!bonds.value?.data?.bonds) return 0
  return Object.values(bonds.value.data.bonds).length
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
