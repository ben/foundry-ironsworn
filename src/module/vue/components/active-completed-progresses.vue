<template>
  <article class="flexcol">
    <DropTarget
      :is="ProgressList"
      dropType="progress"
      :excludedSubtypes="props.excludedSubtypes"
      :progress-stars="progressStars"
      :showCompleted="'no-completed'"
      ref="activeProgressList"
    />
    <ProgressControls class="nogrow" :foeCompendium="foeCompendium" />
    <Collapsible
      :toggleLabel="$t('IRONSWORN.Completed')"
      class="progress-completed nogrow"
      style=""
      :class="$style.completedProgressWrapper"
      toggleButtonClass="clickable text"
      :baseId="`${actor._id}_progress-completed`"
      toggleWrapperIs="h3"
    >
      <ProgressList
        :showCompleted="'completed-only'"
        :excludedSubtypes="props.excludedSubtypes"
        :progress-stars="progressStars"
        :progressListItemClass="$style.completedProgressListItem"
        :class="`${$style.progressList} ${$style.completedProgressList}`"
        ref="completeProgressList"
      />
    </Collapsible>
  </article>
</template>

<style lang="less" module>
.completedProgressWrapper {
  margin-top: var(--ironsworn-spacer-lg);
  border-radius: var(--ironsworn-border-radius-lg);
  border-width: var(--ironsworn-border-width-md);
  border-color: var(--ironsworn-color-fg-10);
  background-color: var(--ironsworn-color-fg-10);
  border-style: solid;
}
.completedProgressList {
  margin: 0 var(--ironsworn-spacer-md) var(--ironsworn-spacer-md);
}
.completedProgressListItem {
  background-color: var(--ironsworn-color-bg-50);
  border-color: var(--ironsworn-color-bg-50);
}
</style>

<script setup lang="ts">
import { computed, inject, ref, Ref } from 'vue'
import { ActorKey } from '../provisions'
import ProgressControls from './progress-controls.vue'
import { IronswornSettings } from '../../helpers/settings'
import Collapsible from './collapsible/collapsible.vue'
import ProgressList from './progress-list.vue'
import DropTarget from '../drop-target.vue'

const props = withDefaults(
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
  }>(),
  { excludedSubtypes: [] }
)

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
