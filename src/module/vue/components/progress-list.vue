<template>
  <ItemList :class="$style.list">
    <CollapseTransition group>
      <ProgressListItem
        v-for="(item, i) in items"
        :key="item._id"
        :i="i"
        :length="items.length"
        :item="item"
        :showStar="progressStars"
        @completed="progressCompleted"
        :compact-progress="compactProgress"
        :class="progressListItemClass"
        class="nogrow"
      />
    </CollapseTransition>
  </ItemList>
</template>

<style lang="scss" module>
.list {
  gap: var(--ironsworn-spacer-md);
}
</style>

<script setup lang="ts">
import { computed, inject, reactive, Ref } from 'vue'
import { $ActorKey, ActorKey } from '../provisions'
import ProgressListItem from './progress/progress-list-item.vue'
import { ProgressDataPropertiesData } from '../../item/itemtypes'
import CollapseTransition from './transition/collapse-transition.vue'
import { getProgressItems, isValidProgressItem } from './progress-common'
import ItemList from 'component:list/item-list.vue'

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

async function applySort(oldI, newI, sortBefore, filterFn) {
  const foundryItems = ($actor?.items ?? [])
    // @ts-ignore
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
  applySort(i, i - 1, true, (item) =>
    isValidProgressItem(item, props.showCompleted, props.excludedSubtypes)
  )
}
function sortDown(i) {
  applySort(i, i + 1, false, (item) =>
    isValidProgressItem(item, props.showCompleted, props.excludedSubtypes)
  )
}

defineExpose({
  applySort,
  sortUp,
  sortDown,
  items,
})
</script>
