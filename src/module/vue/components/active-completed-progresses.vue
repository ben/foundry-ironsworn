<template>
  <article class="flexcol ironsworn__drop__target" data-drop-type="progress">
    <ProgressControls class="nogrow" :foeCompendium="foeCompendium" />
    <ProgressList
      :excludedSubtypes="['bond']"
      :showStar="progressStars"
      :showCompleted="'no-completed'"
      ref="$progressList"
    />
    <Collapsible
      :toggleLabel="$t('IRONSWORN.Completed')"
      :disabled="$completedProgressList?.progressItems?.length === 0"
      class="progress-completed nogrow"
      style=""
      :class="$style.completedProgressWrapper"
      toggleButtonClass="clickable text"
      :baseId="`${actor._id}_progress-completed`"
      toggleWrapperIs="h3"
    >
      <ProgressList
        :showCompleted="'completed-only'"
        :excludedSubtypes="['bond']"
        :showStar="props.progressStars"
        :progressListItemClass="$style.completedProgressListItem"
        :class="`${$style.progressList} ${$style.completedProgressList}`"
        ref="$completedProgressList"
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

const props = defineProps<{
  exclude?: string
  progressStars?: boolean
  /**
   * When true, renders the progress bars for more compact display.
   */
  compactProgress?: boolean
}>()

const $completedProgressList = ref<InstanceType<typeof ProgressList> | null>(
  null
)
const $progressList = ref<InstanceType<typeof ProgressList> | null>(null)

const actor = inject(ActorKey) as Ref

const foeCompendium = computed(() => {
  return IronswornSettings.starforgedToolsEnabled
    ? 'starforgedencounters'
    : 'ironswornfoes'
})
</script>
