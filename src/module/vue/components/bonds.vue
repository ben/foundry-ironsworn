<template>
  <div class="flexcol nogrow">
    <div class="flexrow">
      <h4>{{ $t('IRONSWORN.Bonds') }}</h4>
      <btn-faicon class="block" icon="edit" @click="editBonds" />
      <btn-faicon class="block" icon="dice-d6" @click="rollBonds" />
    </div>
    <progress-track :ticks="bondcount" />
  </div>
</template>

<script setup lang="ts">
import { inject, computed } from 'vue'
import { $ActorKey } from '../provisions'

const actor = inject('actor') as any
const $actor = inject($ActorKey)

const bonds = computed(() => {
  return actor.items.filter((x) => x.type === 'bondset')[0]
})
const bondcount = computed(() => {
  if (!bonds.value?.data?.bonds) return 0
  return Object.values(bonds.value.data.bonds).length
})

function editBonds() {
  const item = $actor?.items.get(bonds.value._id)
  item?.sheet?.render(true)
}
function rollBonds() {
  const item = $actor?.items.get(bonds.value._id)
  item?.writeEpilogue()
}
</script>
