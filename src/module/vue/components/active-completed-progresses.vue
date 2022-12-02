<template>
  <article class="flexcol ironsworn__drop__target" data-drop-type="progress">
    <ProgressList class="nogrow"></ProgressList>
    <!-- <CollapseTransition
      group
      tag="ul"
      class="item-list nogrow"
      :class="$style.progressList"
    >
      <li
        class="flexrow nogrow"
        v-for="(item, i) in activeItems"
        :key="item._id"
      >
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
    </CollapseTransition> -->
    <progress-controls :foeCompendium="foeCompendium" />
    <section class="progress-completed nogrow" style="margin-top: 1rem">
      <Collapsible
        :toggleLabel="$t('IRONSWORN.Completed')"
        :disabled="completedItems.length === 0"
        :class="$style.completedProgressWrapper"
        toggleButtonClass="clickable text"
        :baseId="`${actor._id}_progress-completed`"
        contentWrapperIs="ul"
        :contentWrapperClass="`item-list ${$style.progressList} ${$style.completedProgressList}`"
      >
        <li class="flexrow" v-for="(item, i) in completedItems" :key="item._id">
          <order-buttons
            v-if="editMode"
            :i="i"
            :length="completedItems.length"
            @sortUp="completedSortUp"
            @sortDown="completedSortDown"
          />
          <progress-list-item
            :item="item"
            :class="$style.completedProgressListItem"
            :showStar="progressStars"
            :compact-progress="compactProgress"
          />
        </li>
      </Collapsible>
    </section>
  </article>
</template>

<style lang="less" module>
.progressList {
  gap: var(--ironsworn-spacer-md);
}
.completedProgressListItem {
  background-color: var(--ironsworn-color-bg-50);
  border-color: var(--ironsworn-color-bg-50);
}
.completedProgressWrapper {
  border-radius: var(--ironsworn-border-radius-lg);
  border-width: var(--ironsworn-border-width-md);
  border-color: var(--ironsworn-color-fg-10);
  background-color: var(--ironsworn-color-fg-10);
  border-style: solid;
}
.completedProgressList {
  margin: 0 var(--ironsworn-spacer-md) var(--ironsworn-spacer-md);
}
</style>

<script setup lang="ts">
import { computed, inject, reactive, Ref } from 'vue'
import { $ActorKey, ActorKey } from '../provisions'
import OrderButtons from './order-buttons.vue'
import ProgressListItem from './progress/progress-list-item.vue'
import ProgressControls from './progress-controls.vue'
import BtnFaicon from './buttons/btn-faicon.vue'
import { IronswornSettings } from '../../helpers/settings'
import { compact } from 'lodash'
import { IronswornItem } from '../../item/item'
import {
  ProgressDataProperties,
  ProgressDataPropertiesData,
} from '../../item/itemtypes'
import CollapseTransition from './transition/collapse-transition.vue'
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

const completedItems = computed(() => {
  return progressItems.value.filter((x) => x.system.completed)
})
const editMode = computed(() => {
  return actor.value.flags['foundry-ironsworn']?.['edit-mode']
})

let highlightCompletedTimer: NodeJS.Timer | undefined

const foeCompendium = computed(() => {
  return IronswornSettings.starforgedToolsEnabled
    ? 'starforgedencounters'
    : 'ironswornfoes'
})

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

function completedSortUp(i) {
  applySort(i, i - 1, true, (x) => x.system.completed)
}
function completedSortDown(i) {
  applySort(i, i + 1, false, (x) => x.system.completed)
}
</script>
