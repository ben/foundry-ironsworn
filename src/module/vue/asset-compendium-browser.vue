<template>
  <section
    class="nogrow asset-category"
    v-for="category in data.categories"
    :key="category.title"
  >
    <h2 class="flexrow">
      <IronBtn
        :aria-controls="category.title"
        :text="category.title"
        :icon="category.expanded ? 'fa:caret-down' : 'fa:caret-right'"
        @click="category.expanded = !category.expanded"
      />
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
            :foundry-item="asset.foundryItem"
            v-for="asset in category.assets"
            :key="asset.foundryItem()?.id ?? ''"
            class="nogrow movesheet-row"
          />
        </section>
      </div>
    </CollapseTransition>
  </section>
</template>

<style lang="scss" scoped>
h2 {
  margin: 0;
  border: none;
  height: min-content;
  line-height: 1.5;

  button {
    height: min-content;
    text-transform: uppercase;
    line-height: 1.5;
  }
}

.asset-category {
  margin-bottom: 1em;
  border: var(--ironsworn-border-width-md) solid var(--ironsworn-color-border);
  border-radius: var(--ironsworn-border-radius-lg);
  padding: var(--ironsworn-spacer-md);
}

.asset-category-contents {
  margin: var(--ironsworn-spacer-md) var(--ironsworn-spacer-xl);
}

.category-description {
  padding-bottom: var(--ironsworn-spacer-xl);
}
</style>

<script setup lang="ts">
import { provide, reactive } from 'vue'
import WithRolllisteners from './components/with-rolllisteners.vue'
import AssetBrowserCard from './components/asset/asset-browser-card.vue'
import CollapseTransition from './components/transition/collapse-transition.vue'
import {
  createIronswornAssetTree,
  createStarforgedAssetTree,
  DisplayCategory,
} from '../features/customassets'
import IronBtn from './components/buttons/iron-btn.vue'

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
