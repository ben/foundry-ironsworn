<template>
  <article class="flexcol" :class="$style.wrapper">
    <nav class="flexrow nogrow" :class="$style['nav-search']">
      <input
        type="search"
        :placeholder="$t('IRONSWORN.Search')"
        v-model="state.searchQuery"
        @keydown.enter.prevent
      />
      <BtnFaicon
        icon="times-circle"
        class="nogrow clickable text"
        @click="clearSearch()"
        :class="$style['search-btn']"
      />
      <BtnFaicon
        icon="compress-alt"
        class="nogrow clickable text"
        @click="collapseAll()"
        :class="$style['search-btn']"
      />
    </nav>

    <ul
      v-if="state.searchQuery"
      class="flexcol item-list"
      :class="$style['item-list']"
    >
      <!-- Flat search results -->
      <li
        v-for="(move, resultIndex) of searchResults"
        :key="resultIndex"
        class="nogrow"
      >
        <SfMoverow :move="move" ref="allMoves" />
      </li>
    </ul>

    <ul v-else class="flexcol item-list" :class="$style['item-list']">
      <!-- Categorized moves if not searching -->
      <li
        v-for="(category, catIndex) in state.categories"
        :key="catIndex"
        class="nogrow"
      >
        <SfMoveCategoryRows :category="category" ref="allCategories" />
      </li>
    </ul>
  </article>
</template>

<style lang="less" module>
.nav-search {
  margin-top: 0.5rem;
}
.search-btn {
  padding: 6px;
}
.wrapper {
  gap: 0.5rem;
}
.item-list {
  scrollbar-width: thin;
  margin: 0 -7px 0 0 !important;
  padding-right: 7px !important;
  scrollbar-gutter: stable both-edges;
  gap: 0.5rem;
}
</style>

<script setup lang="ts">
import { flatten } from 'lodash'
import { computed, inject, provide, reactive, ref, Ref } from 'vue'
import {
  createIronswornMoveTree,
  createStarforgedMoveTree,
  MoveCategory,
} from '../../features/custommoves'
import SfMoveCategoryRows from './sf-move-category-rows.vue'
import SfMoverow from './sf-moverow.vue'
import BtnFaicon from './buttons/btn-faicon.vue'

const props = defineProps<{ toolset: 'ironsworn' | 'starforged' }>()
provide('toolset', props.toolset)

const state = reactive({
  searchQuery: '',
  categories: [] as MoveCategory[],
})

let allCategories = ref<InstanceType<typeof SfMoveCategoryRows>[]>([])
let allMoves = ref<InstanceType<typeof SfMoverow>[]>([])

const tempCategories =
  props.toolset === 'ironsworn'
    ? await createIronswornMoveTree()
    : await createStarforgedMoveTree()
for (const category of tempCategories) {
  for (const move of category.moves) {
    ;(move as any).highlighted = false
  }
}
state.categories = tempCategories

const checkedSearchQuery = computed(() => {
  try {
    new RegExp(state.searchQuery)
    return state.searchQuery
  } catch (error) {
    return ''
  }
})

const flatMoves = computed(() => {
  return flatten(state.categories.map((x) => x.moves))
})

const searchResults = computed(() => {
  if (!checkedSearchQuery.value) return null

  const re = new RegExp(checkedSearchQuery.value, 'i')
  return flatMoves.value.filter((x) => re.test(x.displayName))
})

function clearSearch() {
  state.searchQuery = ''
}

function collapseAll() {
  for (const cat of allCategories.value ?? []) {
    cat.collapseChildren()
  }

  for (const mv of allMoves.value ?? []) {
    mv.collapsible?.collapse()
  }
}

CONFIG.IRONSWORN.emitter.on('highlightMove', (_item) => {
  state.searchQuery = ''
})
</script>
