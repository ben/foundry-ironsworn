<template>
  <div class="flexcol">
    <div class="flexcol ironsworn__drop__target" data-drop-type="progress">
      <transition-group name="slide" tag="div" class="nogrow">
        <div
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
        </div>
      </transition-group>
      <progress-controls :foeCompendium="foeCompendium" />
    </div>

    <div class="item-row nogrow progress-completed" style="margin-top: 1rem">
      <!-- TODO: refactor this as a component in PR for collapsible/progressive disclosure element -->
      <h3>
        <btn-faicon
          :disabled="completedItems.length === 0"
          class="text collapse-control"
          :class="completedClass"
          :icon="completedCaret"
          @click="data.expandCompleted = !data.expandCompleted"
          >{{ $t('IRONSWORN.Completed') }}</btn-faicon
        >
      </h3>
      <transition
        name="slide"
        tag="div"
        class="nogrow completed"
        style="margin: 0; padding: 0"
      >
        <div v-if="data.expandCompleted">
          <transition-group name="slide" tag="div" class="nogrow">
            <div
              class="flexrow"
              v-for="(item, i) in completedItems"
              :key="item._id"
            >
              <order-buttons
                v-if="editMode"
                :i="i"
                :length="completedItems.length"
                @sortUp="completedSortUp"
                @sortDown="completedSortDown"
              />
              <progress-list-item
                :item="item"
                :showStar="progressStars"
                :compact-progress="compactProgress"
              />
            </div>
          </transition-group>
        </div>
      </transition>
    </div>
  </div>
</template>

<style lang="less">
.progress-completed {
  .collapse-control {
    text-transform: uppercase;
    height: inherit;
    width: inherit;
    flex-grow: 1;
  }
  h3 {
    display: flex;
  }
  .highlighted {
    background-color: lightyellow;
  }
}
</style>

<style lang="less" scoped>
h3 {
  margin: 5px 0;
  transition: background-color 0.2s ease;
  i {
    width: 15px;
    text-align: center;
  }

  &.highlighted {
    background-color: lightyellow;
  }
}
.slide-enter-active,
.slide-leave-active {
  max-height: 106px;
  &.completed {
    max-height: 400px;
  }
}
</style>

<script setup lang="ts">
import { computed, inject, reactive, Ref } from 'vue'
import { $ActorKey } from '../provisions'
import OrderButtons from './order-buttons.vue'
import ProgressListItem from './progress/progress-list-item.vue'
import ProgressControls from './progress-controls.vue'
import BtnFaicon from './buttons/btn-faicon.vue'
import { IronswornSettings } from '../../helpers/settings'
import { compact } from 'lodash'
import { IronswornItem } from '../../item/item'
import { ProgressDataProperties } from '../../item/itemtypes'

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

const actor = inject('actor') as Ref
const $actor = inject($ActorKey)

const excludedSubtypes = compact([props.exclude])
const progressItems = computed(() => {
  return actor.value.items
    .filter((x) => x.type === 'progress')
    .filter((x) => !excludedSubtypes.includes(x.data.subtype))
    .sort((a, b) => (a.sort || 0) - (b.sort || 0))
})
const activeItems = computed(() => {
  return progressItems.value.filter((x) => !x.data.completed)
})
const completedItems = computed(() => {
  return progressItems.value.filter((x) => x.data.completed)
})
const editMode = computed(() => {
  return actor.value.flags['foundry-ironsworn']?.['edit-mode']
})
const completedCaret = computed(() => {
  return data.expandCompleted ? 'caret-down' : 'caret-right'
})
const completedClass = computed(() => {
  return data.highlightCompleted ? 'highlighted' : undefined
})

let highlightCompletedTimer: NodeJS.Timer | undefined
function progressCompleted() {
  data.highlightCompleted = true
  clearTimeout(highlightCompletedTimer)
  highlightCompletedTimer = setTimeout(() => {
    data.highlightCompleted = false
  }, 2000)
}

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
          (x.data as ProgressDataProperties).data.subtype
        )
    )
    .filter(filterFn)
    .sort((a, b) => (a.data.sort || 0) - (b.data.sort || 0))
  const updates = SortingHelpers.performIntegerSort(foundryItems[oldI], {
    target: (foundryItems ?? [])[newI],
    siblings: foundryItems,
    sortBefore,
  })
  await Promise.all(updates.map(({ target, update }) => target.update(update)))
}
function sortUp(i) {
  applySort(i, i - 1, true, (x) => !x.data.data.completed)
}
function sortDown(i) {
  applySort(i, i + 1, false, (x) => !x.data.data.completed)
}
function completedSortUp(i) {
  applySort(i, i - 1, true, (x) => x.data.data.completed)
}
function completedSortDown(i) {
  applySort(i, i + 1, false, (x) => x.data.data.completed)
}
</script>
