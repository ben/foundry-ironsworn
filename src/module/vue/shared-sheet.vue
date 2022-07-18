<template>
  <div class="flexcol">
    <header class="sheet-header nogrow">
      <document-img :document="actor" />
      <document-name :document="actor" />
    </header>

    <section class="sheet-area nogrow">
      <h4 class="clickable text" @click="rollSupply">
        {{ $t('IRONSWORN.Supply') }}
      </h4>

      <boxrow
        style="line-height: 25px"
        :min="0"
        :max="5"
        :current="actor.data.supply"
        @click="setSupply"
      />
    </section>

    <section v-if="hasBonds" class="sheet-area nogrow">
      <bonds :actor="actor" />
    </section>

    <section
      class="sheet-area ironsworn__drop__target"
      data-drop-type="progress"
    >
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
          <progress-box
            :item="item"
            :actor="actor"
            @completed="progressCompleted"
          />
        </div>
      </transition-group>

      <progress-controls :actor="actor" />
    </section>

    <section
      class="item-row nogrow progress-completed"
      style="margin-top: 1rem"
    >
      <h3>
        <btn-faicon
          :disabled="completedItems.length === 0"
          class="text collapse-control"
          :class="completedClass"
          :icon="completedCaret"
          @click="data.expandCompleted = !data.expandCompleted"
        >
          {{ $t('IRONSWORN.Completed') }}
        </btn-faicon>
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
              :key="item._id ?? ''"
            >
              <order-buttons
                v-if="editMode"
                :i="i"
                :length="completedItems.length"
                @sortUp="completedSortUp"
                @sortDown="completedSortDown"
              />
              <progress-box :item="item" :actor="actor" :showStar="true" />
            </div>
          </transition-group>
        </div>
      </transition>
    </section>

    <section class="sheet-area">
      <h4 class="nogrow">{{ $t('IRONSWORN.Notes') }}</h4>
      <mce-editor
        v-model="actor.data.biography"
        @save="saveNotes"
        @change="throttledSaveNotes"
      />
    </section>
  </div>
</template>

<style lang="less" scoped>
.slide-enter-active,
.slide-leave-active {
  max-height: 83px;
}

h3 {
  margin: 5px 0;
  transition: background-color 0.2s ease;
}

textarea.notes {
  border-color: rgba(0, 0, 0, 0.1);
  border-radius: 1px;
  font-family: var(--font-primary);
  resize: none;
  flex: 1;
  min-height: 150px;
}
</style>

<script setup lang="ts">
import { provide, computed, reactive, inject } from 'vue'
import { IronswornActor } from '../actor/actor'
import { RollDialog } from '../helpers/rolldialog'
import { IronswornSettings } from '../helpers/settings'
import { $ActorKey } from './provisions'
import DocumentImg from './components/document-img.vue'
import DocumentName from './components/document-name.vue'
import Boxrow from './components/boxrow/boxrow.vue'
import OrderButtons from './components/order-buttons.vue'
import ProgressBox from './components/progress/progress-box.vue'
import ProgressControls from './components/progress-controls.vue'
import BtnFaicon from './components/buttons/btn-faicon.vue'
import Bonds from './components/bonds.vue'
import MceEditor from './components/mce-editor.vue'
import { throttle } from 'lodash'

const props =
  defineProps<{ actor: ReturnType<typeof IronswornActor.prototype.toObject> }>()
provide(
  'actor',
  computed(() => props.actor)
)
const $actor = inject($ActorKey)

const data = reactive({
  expandCompleted: false,
  highlightCompleted: false,
})

const progressItems = computed(() => {
  return [
    ...props.actor.items.filter((x) => x.type === 'vow'),
    ...props.actor.items.filter((x) => x.type === 'progress'),
  ].sort((a, b) => (a.sort || 0) - (b.sort || 0))
})
const activeItems = computed(() => {
  return progressItems.value.filter((x) => !x.data.completed)
})
const completedItems = computed(() => {
  return progressItems.value.filter((x) => x.data.completed)
})
const editMode = computed(() => {
  return props.actor.flags['foundry-ironsworn']?.['edit-mode']
})
const completedCaret = computed(() => {
  return 'fa fa-caret-' + (data.expandCompleted ? 'down' : 'right')
})
const completedClass = computed(() => {
  return data.highlightCompleted ? 'highlighted' : undefined
})
const hasBonds = computed(() => {
  const bonds = props.actor.items.find((x) => x.type === 'bondset')
  const markedBonds = bonds?.data?.bonds?.length
  return markedBonds && markedBonds > 0
})
function setSupply(value) {
  $actor?.update({ data: { supply: value } })
  IronswornSettings.maybeSetGlobalSupply(value)
}
function rollSupply() {
  RollDialog.show({
    actor: $actor,
    stat: 'supply',
  })
}

let highlightCompletedTimer: NodeJS.Timer | undefined
function progressCompleted() {
  data.highlightCompleted = true
  clearTimeout(highlightCompletedTimer)
  highlightCompletedTimer = setTimeout(() => {
    data.highlightCompleted = false
  }, 2000)
}
function saveNotes() {
  $actor?.update({ 'data.biography': props.actor.data.biography })
}
const throttledSaveNotes = throttle(saveNotes, 1000)
async function applySort(oldI, newI, sortBefore, filterFn) {
  const foundryItems = ($actor?.items ?? [])
    .filter((x) => x.type === 'progress')
    .filter((x) => x.data.data.subtype !== 'bond')
    .filter(filterFn)
    .sort((a, b) => (a.data.sort || 0) - (b.data.sort || 0))
  const updates = SortingHelpers.performIntegerSort(foundryItems[oldI], {
    target: foundryItems[newI],
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
