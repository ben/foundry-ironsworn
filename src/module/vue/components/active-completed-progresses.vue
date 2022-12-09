<template>
  <article class="flexcol">
    <DropTarget
      :is="ProgressList"
      dropType="progress"
      :excludedSubtypes="['bond']"
      :progress-stars="progressStars"
      :showCompleted="'no-completed'"
    />
    <ProgressControls class="nogrow" :foeCompendium="foeCompendium" />
    <CompletedProgressList
      class="nogrow"
      :collapsibleProps="{ toggleWrapperIs: 'h3' }"
    />
  </article>
</template>

<style lang="less" module></style>

<script setup lang="ts">
import { computed } from 'vue'
import ProgressControls from './progress-controls.vue'
import { IronswornSettings } from '../../helpers/settings'
import ProgressList from './progress-list.vue'
import DropTarget from '../drop-target.vue'
import CompletedProgressList from './completed-progress-list.vue'

defineProps<{
  exclude?: string
  progressStars?: boolean
  /**
   * When true, renders the progress bars for more compact display.
   */
  compactProgress?: boolean
}>()

const foeCompendium = computed(() => {
  return IronswornSettings.starforgedToolsEnabled
    ? 'starforgedencounters'
    : 'ironswornfoes'
})
</script>
