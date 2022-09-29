<template>
  <section v-for="category in data.categories" :key="category.df.$id">
    <h2>{{ category.title }}</h2>
    <WithRolllisteners
      element="p"
      v-html="$enrichMarkdown(category.description)"
    />

    <AssetBrowserCard
      :df="asset.df"
      :foundry-item="asset.foundryItem"
      v-for="asset in category.assets"
      :key="asset.df.$id"
      class="flexcol nogrow movesheet-row"
    />
  </section>
</template>

<script setup lang="ts">
import { IAsset, IAssetType } from 'dataforged'
import { reactive } from 'vue'
import { hashLookup, renderLinksInStr } from '../dataforged'
import { ISAssetTypes, SFAssetTypes } from '../dataforged/data'
import { IronswornItem } from '../item/item'
import { AssetDataProperties } from '../item/itemtypes'
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
  assets: DisplayAsset[]
}
const data = reactive({
  categories: [] as DisplayCategory[],
})

// Kick into async without requiring a <Suspense>
Promise.resolve().then(async () => {
  const pack = game.packs.get(`foundry-ironsworn.${props.toolset}assets`)
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
})
</script>
