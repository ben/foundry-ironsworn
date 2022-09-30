<template>
  <section
    class="nogrow"
    v-for="category in data.categories"
    :key="category.df.$id"
    :style="`--transition-max-height: ${category.maxHeight}px`"
  >
    <header class="nogrow flexrow">
      <button
        type="button"
        @click="category.expanded = !category.expanded"
        :aria-controls="category.df.$id"
        class="clickable text asset-expand-toggle"
      >
        <h2>{{ category.title }}</h2>
      </button>
    </header>

    <Transition name="slide">
      <section
        v-if="category.expanded"
        :aria-expanded="category.expanded"
        :id="category.df.$id"
      >
        <WithRolllisteners
          element="p"
          v-html="$enrichMarkdown(category.description)"
          @moveclick="moveClick"
        />
        <AssetBrowserCard
          :df="asset.df"
          :foundry-item="asset.foundryItem"
          v-for="asset in category.assets"
          :key="asset.df.$id"
          class="flexcol nogrow movesheet-row"
        />
      </section>
    </Transition>
  </section>
</template>

<style lang="less" scoped>
.slide-enter-active,
.slide-leave-active {
  max-height: var(--transition-max-height);
}
</style>

<script setup lang="ts">
import { IAsset, IAssetType } from 'dataforged'
import { provide, reactive } from 'vue'
import { hashLookup, renderLinksInStr } from '../dataforged'
import { ISAssetTypes, SFAssetTypes } from '../dataforged/data'
import { IronswornItem } from '../item/item'
import WithRolllisteners from './components/with-rolllisteners.vue'
import AssetBrowserCard from './components/asset/asset-browser-card.vue'

const props = defineProps<{ toolset: 'starforged' | 'ironsworn' }>()

interface DisplayAsset {
  df: IAsset
  foundryItem: Readonly<IronswornItem>
}
interface DisplayCategory {
  df: IAssetType
  title: string
  description: string
  expanded: boolean
  maxHeight: number
  assets: DisplayAsset[]
}
const data = reactive({
  categories: [] as DisplayCategory[],
})

provide('toolset', props.toolset)

const packName = `foundry-ironsworn.${props.toolset}assets`

// Kick into async without requiring a <Suspense>
async function resolveAssets() {
  const pack = game.packs.get(packName)
  if (!pack)
    throw new Error(`can't load pack foundry-ironsworn.${props.toolset}assets`)

  const assetTypes =
    props.toolset === 'starforged' ? SFAssetTypes : ISAssetTypes

  const categories = [] as DisplayCategory[]
  for (const dfAssetType of assetTypes) {
    const i18nKeyBase = `IRONSWORN.Asset Categories.${dfAssetType.Name}.`
    const i18nDescription = game.i18n.localize(i18nKeyBase + 'Description')
    const cat: DisplayCategory = {
      df: dfAssetType,
      title: game.i18n.localize(i18nKeyBase + 'Title'),
      description: renderLinksInStr(i18nDescription),
      expanded: false,
      maxHeight: 200 + dfAssetType.Assets.length * 25,
      assets: [],
    }

    for (const dfAsset of dfAssetType.Assets) {
      const item = (await pack.getDocument(
        hashLookup(dfAsset.$id)
      )) as IronswornItem
      cat.assets.push({
        df: dfAsset,
        foundryItem: Object.freeze(item),
      })
    }

    categories.push(cat)
  }

  data.categories = categories
}
resolveAssets()

function moveClick() {
  // TODO:
}
</script>
