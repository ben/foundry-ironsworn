<template>
  <div class="flexrow">
    <div class="flexcol">
      <section class="sheet-area flexcol">
        <!-- Bonds -->
        <Bonds :compactProgress="true" data-tourid="bonds" />

        <hr class="nogrow" />

        <!-- Assets -->
        <AssetsList>
          <template #start>
            <h4 class="nogrow">
              {{ $t('IRONSWORN.ITEMS.TypeAsset') }}
            </h4>
          </template>
        </AssetsList>
      </section>
    </div>
    <ActiveCompletedProgresses
      :compactProgress="true"
      :class="$style.progress"
      data-tourid="progress"
    />
  </div>
</template>
<style lang="scss" module>
.progress {
  margin-top: var(--ironsworn-spacer-md);
}
</style>
<style lang="scss" scoped>
h4 {
  text-transform: uppercase;
}

h3 {
  transition: background-color 0.2s ease;
  margin: var(--ironsworn-spacer-md) 0;

  i {
    width: 15px;
    text-align: center;
  }
}
</style>

<script lang="ts" setup>
import { computed, inject, Ref } from 'vue'
import { $ActorKey, ActorKey } from '../../provisions'
import Bonds from '../bonds.vue'
import ActiveCompletedProgresses from '../active-completed-progresses.vue'
import { AssetCompendiumBrowser } from '../../../item/asset-compendium-browser'
import AssetsList from './assets-list.vue'

const actor = inject(ActorKey) as Ref
const $actor = inject($ActorKey)

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
