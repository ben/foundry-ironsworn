<template>
  <DropTarget
    dropType="asset"
    is="article"
    class="flexcol"
    :class="$style.wrapper"
  >
    <slot name="start"></slot>
    <SortableItemList
      :class="$style.list"
      :filterFn="(item) => item?.type === 'asset'"
    >
      <template #itemContent="{ item }">
        <AssetCard
          :asset="item"
          :collapsible="true"
          :showUncheckedAbilities="false"
          :editable="false"
          :showAssetType="true"
        >
          <template #headerEnd>
            <div :class="$style.assetControls" class="flexrow nogrow">
              <IronBtn
                v-if="editMode"
                block
                nogrow
                icon="fa:trash"
                @click="destroy"
              />
              <IronBtn block nogrow icon="fa:pen-to-square" @click="edit" />
            </div>
          </template>
        </AssetCard>
      </template>
    </SortableItemList>
    <section
      :class="$style.controls"
      class="flexrow nogrow"
      style="text-align: center"
    >
      <IronBtn
        icon="fa:book-atlas"
        @click="assetBrowser"
        block
        :text="$t('IRONSWORN.ITEMS.TypeAsset')"
      />
    </section>
  </DropTarget>
</template>

<style lang="scss" module>
.controls {
  --ironsworn-line-height: var(--ironsworn-line-height-sm);
}

.assetControls {
  display: flex;
  flex-grow: 0;
  flex-wrap: nowrap;
  justify-items: flex-end;
}

.wrapper {
  gap: var(--ironsworn-spacer-md);
}

.list {
  gap: var(--ironsworn-spacer-md);
}
</style>

<script lang="ts" setup>
import { sortBy } from 'lodash-es'
import { computed, inject, Ref } from 'vue'
import AssetCard from '../asset/asset-card.vue'
import IronBtn from '../buttons/iron-btn.vue'
import { $ActorKey, ActorKey } from '../../provisions'
import { AssetCompendiumBrowser } from '../../../item/asset-compendium-browser'
import CollapseTransition from '../transition/collapse-transition.vue'
import DropTarget from '../../drop-target.vue'
import IronList from 'component:list/iron-list.vue'
import SortableItem from 'component:list/sortable-item.vue'
import SortableItemList from 'component:list/sortable-item-list.vue'

const actor = inject(ActorKey) as Ref
const $actor = inject($ActorKey)

const editMode = computed(() => {
  return actor.value.flags['foundry-ironsworn']?.['edit-mode']
})
const assets = computed(() => {
  const assets = actor.value.items.filter((x) => x.type === 'asset')
  return sortBy(assets, (x) => x.sort)
})

async function applySort(oldI, newI, sortBefore) {
  const foundryItems = $actor?.items
    .filter((x) => x.type === 'asset')
    .sort((a, b) => (a.data.sort || 0) - (b.data.sort || 0))
  const updates = SortingHelpers.performIntegerSort(foundryItems?.[oldI], {
    target: (foundryItems ?? [])[newI],
    siblings: foundryItems,
    sortBefore,
  })
  await Promise.all(updates.map(({ target, update }) => target?.update(update)))
}
function sortUp(i) {
  applySort(i, i - 1, true)
}
function sortDown(i) {
  applySort(i, i + 1, false)
}

function edit(i) {}
function destroy(i) {}

let theAssetBrowser: AssetCompendiumBrowser | undefined
function assetBrowser() {
  if (!theAssetBrowser) {
    theAssetBrowser = new AssetCompendiumBrowser(
      $actor?.toolset ?? 'starforged'
    )
  }
  theAssetBrowser.render(true, { focus: true })
}
</script>
