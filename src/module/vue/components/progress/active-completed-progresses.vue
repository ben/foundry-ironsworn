<template>
  <article class="flexcol">
    <DropTarget
      dropType="progress"
      :is="SortableItemList"
      :filterFn="(item) => filterFn(item) && !item.system.completed"
    >
      <template #item="{ item, i, length }">
        <ProgressListItem
          :item="item"
          :i="i"
          :length="length"
          :showStar="progressStars"
          :compactProgress="compactProgress"
        />
      </template>
    </DropTarget>
    <ProgressControls class="nogrow" :foeCompendium="foeCompendium" />
    <CompletedProgressList
      class="nogrow"
      :collapsibleProps="{ toggleWrapperIs: 'h3' }"
    />
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import ProgressControls from './progress-controls.vue'
import { IronswornSettings } from '../../../helpers/settings'
import DropTarget from '../../drop-target.vue'
import CompletedProgressList from './completed-progress-list.vue'
import SortableItemList from 'component:list/sortable-item-list.vue'
import ProgressListItem from 'component:progress/progress-list-item.vue'
import { ItemLike } from 'component:list/helpers'

defineProps<{
  /**
   * List of progress subtypes to exclude from the list. To leave out
   * connections, pass `['bond']` here.
   */
  excludedSubtypes?: string[]
  progressStars?: boolean
  /**
   * When true, renders the progress bars for more compact display.
   */
  compactProgress?: boolean
  filterFn: (item: ItemLike) => boolean | undefined
}>()

const foeCompendium = computed(() => {
  return IronswornSettings.starforgedToolsEnabled
    ? 'starforgedencounters'
    : 'ironswornfoes'
})
</script>
