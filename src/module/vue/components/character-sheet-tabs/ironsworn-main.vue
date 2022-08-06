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
            v-for="(item, i) in progressItems"
            :key="item._id"
          >
            <OrderButtons
              v-if="editMode"
              :i="i"
              :length="progressItems.length"
              @sortUp="progressSortUp"
              @sortDown="progressSortDown"
            />
            <ProgressBox :item="item" />
          </div>
        </transition-group>

        <ProgressControls />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, inject } from 'vue'
import { $ActorKey } from '../../provisions'
import Bonds from '../bonds.vue'
import OrderButtons from '../order-buttons.vue'
import Asset from '../asset/asset.vue'
import BtnCompendium from '../buttons/btn-compendium.vue'
import ProgressBox from '../progress/progress-box.vue'
import ProgressControls from '../progress-controls.vue'
import { throttle } from 'lodash'

const actor = inject('actor') as Ref
const $actor = inject($ActorKey)

const progressItems = computed(() => {
  return actor.value?.items
    .filter((x) => x.type === 'progress')
    .sort((a, b) => (a.sort || 0) - (b.sort || 0))
})
const assets = computed(() => {
  return actor.value?.items
    .filter((x) => x.type === 'asset')
    .sort((a, b) => (a.sort || 0) - (b.sort || 0))
})
const editMode = computed(() => {
  return actor.value?.flags['foundry-ironsworn']?.['edit-mode']
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
</script>
