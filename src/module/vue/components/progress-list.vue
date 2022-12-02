<template>
  <ul class="progress-list item-list" :class="$style.progressList">
    <li class="flexrow nogrow" v-for="(item, i) in activeItems" :key="item._id">
      <order-buttons
        v-if="editMode"
        :i="i"
        :length="activeItems.length"
        @sortUp="sortUp"
        @sortDown="sortDown"
      />
      <progress-list-item
        :item="item"
        :showStar="progressStars"
        @completed="progressCompleted"
        :compact-progress="compactProgress"
      />
    </li>
  </ul>
</template>

<style lang="less" module>
.progressList {
  gap: var(--ironsworn-spacer-md);
}
</style>

<script setup lang="ts">
import { computed, inject, reactive, Ref } from 'vue'
import { $ActorKey, ActorKey } from '../provisions'
import OrderButtons from './order-buttons.vue'
import ProgressListItem from './progress/progress-list-item.vue'
import { compact } from 'lodash'
import { ProgressDataPropertiesData } from '../../item/itemtypes'

const props = defineProps<{
  exclude?: ProgressDataPropertiesData['subtype']
  progressStars?: boolean
  /**
   * When true, renders the progress bars for more compact display.
   */
  compactProgress?: boolean
}>()

const data = reactive({
  expandCompleted: false,
  highlightCompleted: false,
})

const actor = inject(ActorKey) as Ref
const $actor = inject($ActorKey)

const excludedSubtypes = compact([props.exclude])
const progressItems = computed(() => {
  return actor.value.items
    .filter((x) => x.type === 'progress')
    .filter((x) => !excludedSubtypes.includes(x.system.subtype))
    .sort((a, b) => (a.sort || 0) - (b.sort || 0))
})
const activeItems = computed(() => {
  return progressItems.value.filter((x) => !x.system.completed)
})
const editMode = computed(() => {
  return actor.value.flags['foundry-ironsworn']?.['edit-mode']
})

let highlightCompletedTimer: NodeJS.Timer | undefined
function progressCompleted() {
  data.highlightCompleted = true
  clearTimeout(highlightCompletedTimer)
  highlightCompletedTimer = setTimeout(() => {
    data.highlightCompleted = false
  }, 2000)
}

async function applySort(oldI, newI, sortBefore, filterFn) {
  const foundryItems = ($actor?.items ?? [])
    .filter((x) => x.type === 'progress')
    .filter(
      (x) =>
        !excludedSubtypes.includes(
          (x.system as ProgressDataPropertiesData).subtype
        )
    )
    .filter(filterFn)
    .sort((a, b) => (a.sort || 0) - (b.sort || 0))
  const updates = SortingHelpers.performIntegerSort(foundryItems[oldI], {
    target: (foundryItems ?? [])[newI],
    siblings: foundryItems,
    sortBefore,
  })
  await Promise.all(updates.map(({ target, update }) => target.update(update)))
}
function sortUp(i) {
  applySort(i, i - 1, true, (x) => !x.system.completed)
}
function sortDown(i) {
  applySort(i, i + 1, false, (x) => !x.system.completed)
}
</script>
