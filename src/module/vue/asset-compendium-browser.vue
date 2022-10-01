<template>
  <section
    class="nogrow asset-category"
    v-for="category in data.categories"
    :key="category.df.$id"
    :style="`--transition-max-height: ${category.maxHeight}px`"
  >
    <h2 class="flexrow">
      <BtnFaicon
        :icon="category.expanded ? 'caret-down' : 'caret-right'"
        :aria-controls="category.df.$id"
        class="juicy text"
        @click="category.expanded = !category.expanded"
      >
        {{ category.title }}
      </BtnFaicon>
    </h2>

    <Transition name="slide">
      <div v-if="category.expanded">
        <section
          class="asset-category-contents"
          :aria-expanded="category.expanded"
          :id="category.df.$id"
        >
          <WithRolllisteners
            element="div"
            class="category-description"
            v-html="$enrichMarkdown(category.description)"
            @moveclick="moveClick"
          />

          <AssetBrowserCard
            :df="asset.df"
            :foundry-item="(asset.foundryItem as any)"
            v-for="asset in category.assets"
            :key="asset.df.$id"
            class="flexcol nogrow movesheet-row"
          />
        </section>
      </div>
    </Transition>
  </section>
</template>

<style lang="less" scoped>
.slide-enter-active,
.slide-leave-active {
  max-height: var(--transition-max-height);
}

h2 {
  margin: 0;
  line-height: 1.5;
  border: none;
  height: min-content;
  button {
    line-height: 1.5;
    height: min-content;
    text-transform: uppercase;
  }
}

.asset-category {
  margin-bottom: 1em;
  padding: 5px;
  border: 1px solid;
  border-radius: 5px;
}

.asset-category-contents {
  margin: 5px 10px;
}

.category-description {
  margin: 10px 0;
}
</style>

<script setup lang="ts">
import { IAsset, IAssetType } from 'dataforged'
import { capitalize, provide, reactive } from 'vue'
import { hashLookup, renderLinksInStr } from '../dataforged'
import { ISAssetTypes, SFAssetTypes } from '../dataforged/data'
import { IronswornItem } from '../item/item'
import WithRolllisteners from './components/with-rolllisteners.vue'
import AssetBrowserCard from './components/asset/asset-browser-card.vue'
import BtnFaicon from './components/buttons/btn-faicon.vue'

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

  const i18n = (categoryName: string, extension: string) => {
    const capCat = capitalize(categoryName)
    const capToolset = capitalize(props.toolset)
    return game.i18n.localize(
      `IRONSWORN.Asset Categories.${capToolset}.${capCat}.${extension}`
    )
  }

  const categories = [] as DisplayCategory[]
  for (const dfAssetType of assetTypes) {
    const i18nDescription = i18n(dfAssetType.Name, 'Description')
    const cat: DisplayCategory = {
      df: dfAssetType,
      title: i18n(dfAssetType.Name, 'Title'),
      description: renderLinksInStr(i18nDescription),
      expanded: false,
      maxHeight: 200 + dfAssetType.Assets.length * 30,
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
