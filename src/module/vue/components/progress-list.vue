<template>
  <CollapseTransition
    group
    tag="ul"
    class="progress-list item-list"
    :class="$style.progressList"
  >
    <li
      class="flexrow nogrow"
      v-for="(item, i) in progressItems"
      :key="item._id"
    >
      <OrderButtons
        v-if="editMode"
        :i="i"
        :length="progressItems.length"
        @sortUp="sortUp"
        @sortDown="sortDown"
      />
      <ProgressListItem
        :item="item"
        :showStar="progressStars"
        @completed="progressCompleted"
        :compact-progress="compactProgress"
        :class="progressListItemClass"
      />
    </li>
  </CollapseTransition>
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
import { ProgressDataPropertiesData } from '../../item/itemtypes'
import CollapseTransition from './transition/collapse-transition.vue'

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

function isValidProgressItem(item: any) {
  if (item.type === 'progress') {
    console.log('evaluating progress item', item)
    switch (props.showCompleted) {
      case 'completed-only': {
        if (!item.system.completed) {
          return false
        }
        break
      }
      case 'no-completed': {
        if (item.system.completed) {
          return false
        }
        break
      }
      default:
        break
    }
    if ((props.excludedSubtypes ?? []).includes(item.system.subtype)) {
      return false
    }
    return true
  }
  return false
}

const progressItems = computed(() => {
  return actor.value.items
    .filter((item) => isValidProgressItem(item))
    .sort((a, b) => (a.sort || 0) - (b.sort || 0)) as any[]
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
  applySort(i, i - 1, true, (item) => isValidProgressItem(item))
}
function sortDown(i) {
  applySort(i, i + 1, false, (item) => isValidProgressItem(item))
}

defineExpose({
  applySort,
  sortUp,
  sortDown,
  progressItems,
})
</script>
