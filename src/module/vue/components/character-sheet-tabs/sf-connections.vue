<template>
  <div class="flexcol">
    <transition-group name="slide" tag="div" class="nogrow">
      <div
        class="flexrow nogrow"
        v-for="(item, i) in connections"
        :key="item._id"
      >
        <order-buttons
          v-if="editMode"
          :i="i"
          :length="connections.length"
          @sortUp="sortUp"
          @sortDown="sortDown"
        />
        <progress-box :item="item" :showStar="true" />
      </div>
    </transition-group>

    <div class="flexrow nogrow" style="text-align: center">
      <btn-faicon icon="plus" class="block" @click="newConnection">
        {{ $t('IRONSWORN.Connection') }}
      </btn-faicon>
    </div>
  </div>
</template>

<style lang="less" scoped>
.slide-enter-active,
.slide-leave-active {
  max-height: 83px;
}
</style>

<script setup lang="ts">
import { computed, inject, Ref } from 'vue'
import { $ActorKey } from '../../provisions'
import OrderButtons from '../order-buttons.vue'
import ProgressBox from '../progress/progress-box.vue'
import BtnFaicon from '../buttons/btn-faicon.vue'
import { ProgressDataProperties } from '../../../item/itemtypes'

const actor = inject('actor') as Ref
const $actor = inject($ActorKey)

const connections = computed(() => {
  return actor.value.items
    .filter((x) => x.type === 'progress')
    .filter((x) => x.data.subtype === 'bond') // legacy name
    .sort((a, b) => (a.sort || 0) - (b.sort || 0))
})
const editMode = computed(() => {
  return actor.value.flags['foundry-ironsworn']?.['edit-mode']
})

async function newConnection() {
  const item = await Item.create(
    {
      name: game.i18n.localize('IRONSWORN.Connection'),
      type: 'progress',
      data: { subtype: 'bond' },
      sort: 9000000,
    },
    { parent: $actor }
  )
  item?.sheet?.render(true)
}

async function applySort(oldI, newI, sortBefore) {
  const foundryItems = ($actor?.items ?? [])
    .filter((x) => x.type === 'progress')
    .filter((x) => (x.data as ProgressDataProperties).data.subtype === 'bond')
    .sort((a, b) => (a.data.sort || 0) - (b.data.sort || 0))
  const updates = SortingHelpers.performIntegerSort(foundryItems[oldI], {
    target: (foundryItems ?? [])[newI],
    siblings: foundryItems,
    sortBefore,
  })
  await Promise.all(updates.map(({ target, update }) => target.update(update)))
}
function sortUp(i) {
  applySort(i, i - 1, true)
}
function sortDown(i) {
  applySort(i, i + 1, false)
}
</script>
