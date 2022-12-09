<template>
  <article class="flexcol">
    <DropTarget
      :is="ProgressList"
      dropType="progress"
      :excludedSubtypes="['bond']"
      :progress-stars="progressStars"
      :showCompleted="'no-completed'"
      ref="activeProgressList"
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
import { computed, inject, ref, Ref } from 'vue'
import { ActorKey } from '../provisions'
import ProgressControls from './progress-controls.vue'
import { IronswornSettings } from '../../helpers/settings'
import ProgressList from './progress-list.vue'
import DropTarget from '../drop-target.vue'
import CompletedProgressList from './completed-progress-list.vue'

const props = defineProps<{
  exclude?: string
  progressStars?: boolean
  /**
   * When true, renders the progress bars for more compact display.
   */
  compactProgress?: boolean
}>()

let completeProgressList = ref<InstanceType<typeof ProgressList>>()
// completeProgressList doesn't always exist, so we use the always-on component to check if there's completed items of the correct subtype
let activeProgressList = ref<InstanceType<typeof ProgressList>>()

const actor = inject(ActorKey) as Ref

const foeCompendium = computed(() => {
  return IronswornSettings.starforgedToolsEnabled
    ? 'starforgedencounters'
    : 'ironswornfoes'
})
</script>
