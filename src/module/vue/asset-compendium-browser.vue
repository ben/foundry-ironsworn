<template>
  <section
    class="nogrow asset-category"
    v-for="category in data.categories"
    :key="category.title"
  >
    <h2 class="flexrow">
      <BtnFaicon
        :icon="category.expanded ? 'caret-down' : 'caret-right'"
        :aria-controls="category.title"
        class="juicy text"
        @click="category.expanded = !category.expanded"
      >
        {{ category.title }}
      </BtnFaicon>
    </h2>

    <CollapseTransition>
      <div v-if="category.expanded">
        <section
          class="asset-category-contents"
          :aria-expanded="category.expanded"
          :id="category.title"
        >
          <WithRolllisteners
            v-if="category.description"
            element="div"
            class="category-description"
            v-html="
              category.description && $enrichMarkdown(category.description)
            "
            @moveclick="moveClick"
          />

          <AssetBrowserCard
            :df="asset.df"
            :foundry-item="(asset.foundryItem as any)"
            v-for="asset in category.assets"
            :key="asset.foundryItem.id ?? ''"
            class="nogrow movesheet-row"
          />
        </section>
      </div>
    </CollapseTransition>
  </section>
</template>

<style lang="less" scoped>
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
  padding-bottom: 10px;
}
</style>

<script setup lang="ts">
import { provide, reactive } from 'vue'
import WithRolllisteners from './components/with-rolllisteners.vue'
import AssetBrowserCard from './components/asset/asset-browser-card.vue'
import BtnFaicon from './components/buttons/btn-faicon.vue'
import CollapseTransition from './components/transition/collapse-transition.vue'
import {
  createIronswornAssetTree,
  createStarforgedAssetTree,
  DisplayCategory,
} from '../features/customassets'

const props = defineProps<{ toolset: 'starforged' | 'ironsworn' }>()

const data = reactive({
  categories: [] as DisplayCategory[],
})

provide('toolset', props.toolset)

// Kick into async without requiring a <Suspense>
const promise =
  props.toolset === 'ironsworn'
    ? createIronswornAssetTree()
    : createStarforgedAssetTree()
promise.then((categories) => {
  data.categories = categories
})

function moveClick(item) {
  CONFIG.IRONSWORN.emitter.emit('highlightMove', item.id)
}
</script>
