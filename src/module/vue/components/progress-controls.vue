<template>
  <div class="flexrow nogrow" style="text-align: center">
    <btn-faicon class="block" icon="plus" @click="addProgressItem('vow')">
      {{ $t('IRONSWORN.Vow') }}</btn-faicon
    >
    <btn-faicon class="block" icon="plus" @click="addProgressItem('progress')">
      {{ $t('IRONSWORN.Progress') }}</btn-faicon
    >
    <btn-compendium
      class="block"
      :compendium="props.foeCompendium ?? 'ironswornfoes'"
    >
      {{ $t('IRONSWORN.Foes') }}
    </btn-compendium>
  </div>
</template>

<script setup lang="ts">
import { capitalize, inject } from 'vue'
import { $ActorKey } from '../provisions'
import BtnFaicon from './buttons/btn-faicon.vue'
import BtnCompendium from './buttons/btn-compendium.vue'

const props = defineProps<{ foeCompendium?: string }>()

const $actor = inject($ActorKey)

async function addProgressItem(subtype) {
  const itemData = {
    name: capitalize(subtype),
    type: 'progress',
    data: { subtype },
    sort: 9000000,
  }
  const item = await Item.create(itemData as any, { parent: $actor })
  item?.sheet?.render(true)
}

function openCompendium(name) {
  const pack = game.packs?.get(`foundry-ironsworn.${name}`)
  pack?.render(true)
}
</script>
