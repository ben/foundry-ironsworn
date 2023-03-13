<template>
  <SortableItemList :class="$style.list" :filterFn="isValidProgress">
    <template #item="{ item, i, length }">
      <ProgressListItem
        :key="item._id!"
        :i="i"
        :length="length"
        :item="item"
        :showStar="progressStars"
        @completed="progressCompleted"
        :compact-progress="compactProgress"
        :class="progressListItemClass"
        class="nogrow"
      />
    </template>
  </SortableItemList>
</template>

<style lang="scss" module>
.list {
  gap: var(--ironsworn-spacer-md);
}
</style>

<script setup lang="ts">
import { computed, inject, reactive, Ref } from 'vue'
import { $ActorKey, ActorKey } from '../../provisions'
import ProgressListItem from './progress-list-item.vue'
import { ProgressDataPropertiesData } from '../../../item/itemtypes'
import { getProgressItems, isValidProgressItem } from '../progress-common'
import SortableItemList from 'component:list/sortable-item-list.vue'

const props = defineProps<{
  excludedSubtypes?: ProgressDataPropertiesData['subtype'][]
  showCompleted: 'completed-only' | 'no-completed' | 'all'
  progressStars?: boolean
  /**
   * When true, renders the progress bars for more compact display.
   */
  compactProgress?: boolean
  progressListItemClass?: string
}>()

function isValidProgress(item) {
  if (item.type != 'progress') return false
  if (props.excludedSubtypes?.includes(item.system.subtype)) return false

  if (props.showCompleted === 'completed-only' && !item.system.completed)
    return false
  if (props.showCompleted === 'no-completed' && item.system.completed)
    return false

  return true
}

const data = reactive({
  expandCompleted: false,
  highlightCompleted: false,
})

const actor = inject(ActorKey) as Ref
const $actor = inject($ActorKey)

const items = computed(() =>
  getProgressItems(actor.value, props.showCompleted, props.excludedSubtypes)
)

let highlightCompletedTimer: NodeJS.Timer | undefined

function progressCompleted() {
  data.highlightCompleted = true
  clearTimeout(highlightCompletedTimer)
  highlightCompletedTimer = setTimeout(() => {
    data.highlightCompleted = false
  }, 2000)
}

defineExpose({
  items,
})
</script>
