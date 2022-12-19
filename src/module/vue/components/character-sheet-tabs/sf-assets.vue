<template>
  <DropTarget
    dropType="asset"
    is="article"
    class="sf-assets flexcol"
    :class="$style.wrapper"
  >
    <CollapseTransition
      tag="ul"
      class="item-list"
      :class="$style.assetList"
      group
    >
      <li class="flexrow" v-for="(asset, i) in assets" :key="asset._id">
        <order-buttons
          v-if="editMode"
          :i="i"
          :length="assets.length"
          @sortUp="sortUp"
          @sortDown="sortDown"
        />
        <asset :asset="asset" class="item-row" />
      </li>
    </CollapseTransition>
    <section class="list-controls flexrow nogrow" style="text-align: center">
      <IronBtn
        icon="fa:book-atlas"
        @click="assetBrowser"
        block
        :text="$t('IRONSWORN.Assets')"
      />
    </section>
  </DropTarget>
</template>

<style lang="less" module>
.wrapper {
  gap: var(--ironsworn-spacer-md);
}
.assetList {
  gap: var(--ironsworn-spacer-md);
}
</style>

<script lang="ts" setup>
import { sortBy } from 'lodash'
import { computed, inject, Ref } from 'vue'
import OrderButtons from '../order-buttons.vue'
import Asset from '../asset/asset.vue'
import IronBtn from '../buttons/iron-btn.vue'
import { $ActorKey, ActorKey } from '../../provisions'
import { AssetCompendiumBrowser } from '../../../item/asset-compendium-browser'
import CollapseTransition from '../transition/collapse-transition.vue'
import DropTarget from '../../drop-target.vue'

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

let theAssetBrowser: AssetCompendiumBrowser | undefined
function assetBrowser() {
  if (!theAssetBrowser) {
    theAssetBrowser = new AssetCompendiumBrowser(
      $actor?.toolset ?? 'starforged'
    )
  }
  theAssetBrowser.render(true)
}
</script>
