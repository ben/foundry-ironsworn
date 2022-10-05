<template>
  <div class="flexcol ironsworn__drop__target" data-drop-type="asset">
    <transition-group name="slide" tag="div" class="nogrow">
      <div class="flexrow" v-for="(asset, i) in assets" :key="asset._id">
        <order-buttons
          v-if="editMode"
          :i="i"
          :length="assets.length"
          @sortUp="sortUp"
          @sortDown="sortDown"
        />
        <asset :asset="asset" />
      </div>
    </transition-group>
    <div class="flexrow nogrow" style="text-align: center">
      <BtnFaicon icon="atlas" @click="assetBrowser" class="clickable block">
        {{ $t('IRONSWORN.Assets') }}
      </BtnFaicon>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { sortBy } from 'lodash'
import { computed, inject, Ref } from 'vue'
import OrderButtons from '../order-buttons.vue'
import Asset from '../asset/asset.vue'
import BtnFaicon from '../buttons/btn-faicon.vue'
import { $ActorKey } from '../../provisions'
import { AssetCompendiumBrowser } from '../../../item/asset-compendium-browser'

const actor = inject('actor') as Ref
const $actor = inject($ActorKey)

const editMode = computed(() => {
  return actor.value.flags['foundry-ironsworn']?.['edit-mode']
})
const assets = computed(() => {
  const assets = actor.value.items.filter((x) => x.type === 'asset')
  return sortBy(assets, (x) => x.sort)
})

function openCompendium() {
  const pack = game.packs?.get('foundry-ironsworn.starforgedassets')
  pack?.render(true)
}
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
