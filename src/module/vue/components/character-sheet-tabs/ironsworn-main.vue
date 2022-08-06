<template>
  <div class="flexrow">
    <div class="flexcol">
      <section class="sheet-area flexcol">
        <!-- Bonds -->
        <Bonds />

        <hr class="nogrow" />
        <!-- Assets -->
        <div class="flexcol ironsworn__drop__target" data-drop-type="asset">
          <h4 class="nogrow">{{ $t('IRONSWORN.Assets') }}</h4>

          <transition-group name="slide" tag="div" class="nogrow">
            <div class="flexrow" v-for="(asset, i) in assets" :key="asset._id">
              <OrderButtons
                v-if="editMode"
                :i="i"
                :length="assets.length"
                @sortUp="assetSortUp"
                @sortDown="assetSortDown"
              />
              <Asset :asset="asset" />
            </div>
          </transition-group>
          <div class="flexcol nogrow" style="text-align: center">
            <BtnCompendium class="block nogrow" compendium="ironswornassets">
              {{ $t('IRONSWORN.Assets') }}
            </BtnCompendium>
          </div>
        </div>
      </section>
    </div>
    <div class="flexcol">
      <!-- Vows & Progress -->
      <div
        class="flexcol sheet-area ironsworn__drop__target"
        data-drop-type="progress"
      >
        <transition-group name="slide" tag="div" class="nogrow">
          <div
            class="flexrow nogrow"
            v-for="(item, i) in activeItems"
            :key="item._id"
          >
            <OrderButtons
              v-if="editMode"
              :i="i"
              :length="activeItems.length"
              @sortUp="progressSortUp"
              @sortDown="progressSortDown"
            />
            <ProgressBox :item="item" @completed="progressCompleted" />
          </div>
        </transition-group>

        <ProgressControls />
      </div>

      <div class="item-row nogrow progress-completed" style="margin-top: 1rem">
        <!-- TODO: refactor this as a component in PR for collapsible/progressive disclosure element -->
        <h3>
          <BtnFaicon
            :disabled="completedItems.length === 0"
            class="text collapse-control"
            :class="completedClass"
            :icon="completedCaret"
            @click="data.expandCompleted = !data.expandCompleted"
          >
            {{ $t('IRONSWORN.Completed') }}
          </BtnFaicon>
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
                <progress-box :item="item" :actor="actor" :showStar="true" />
              </div>
            </transition-group>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

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

<script lang="ts" setup>
import { computed, inject, reactive } from 'vue'
import { $ActorKey } from '../../provisions'
import Bonds from '../bonds.vue'
import OrderButtons from '../order-buttons.vue'
import Asset from '../asset/asset.vue'
import BtnCompendium from '../buttons/btn-compendium.vue'
import ProgressBox from '../progress/progress-box.vue'
import ProgressControls from '../progress-controls.vue'
import { throttle } from 'lodash'
import BtnFaicon from '../buttons/btn-faicon.vue'

const actor = inject('actor') as Ref
const $actor = inject($ActorKey)

const progressItems = computed(() => {
  return actor.value?.items
    .filter((x) => x.type === 'progress')
    .sort((a, b) => (a.sort || 0) - (b.sort || 0))
})
const activeItems = computed(() => {
  return progressItems.value.filter((x) => !x.data.completed)
})
const completedItems = computed(() => {
  return progressItems.value.filter((x) => x.data.completed)
})
const assets = computed(() => {
  return actor.value?.items
    .filter((x) => x.type === 'asset')
    .sort((a, b) => (a.sort || 0) - (b.sort || 0))
})
const editMode = computed(() => {
  return actor.value?.flags['foundry-ironsworn']?.['edit-mode']
})

const data = reactive({
  expandCompleted: false,
  highlightCompleted: false,
})

let highlightCompletedTimer: NodeJS.Timer | undefined
function progressCompleted() {
  data.highlightCompleted = true
  clearTimeout(highlightCompletedTimer)
  highlightCompletedTimer = setTimeout(() => {
    data.highlightCompleted = false
  }, 2000)
}

const completedCaret = computed(() => {
  return data.expandCompleted ? 'caret-down' : 'caret-right'
})
const completedClass = computed(() => {
  return data.highlightCompleted ? 'highlighted' : undefined
})

async function applySort(oldI, newI, sortBefore, collection) {
  const sorted = collection.sort(
    (a, b) => (a.data.sort || 0) - (b.data.sort || 0)
  )
  const updates = SortingHelpers.performIntegerSort(sorted[oldI], {
    target: sorted[newI],
    siblings: sorted,
    sortBefore,
  })
  await Promise.all(updates.map(({ target, update }) => target.update(update)))
}
function assetSortUp(i) {
  const items = $actor?.items.filter((x) => x.type === 'asset')
  applySort(i, i - 1, true, items)
}
function assetSortDown(i) {
  const items = $actor?.items.filter((x) => x.type === 'asset')
  applySort(i, i + 1, false, items)
}
function progressSortUp(i) {
  const items = $actor?.items.filter((x) => x.type === 'progress')
  applySort(i, i - 1, true, items)
}
function progressSortDown(i) {
  const items = $actor?.items.filter((x) => x.type === 'progress')
  applySort(i, i + 1, false, items)
}
function completedSortUp(i) {
  applySort(i, i - 1, true, (x) => x.data.data.completed)
}
function completedSortDown(i) {
  applySort(i, i + 1, false, (x) => x.data.data.completed)
}
</script>
