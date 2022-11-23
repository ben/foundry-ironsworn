<template>
  <article class="flexcol" :class="$style.wrapper">
    <nav class="flexrow nogrow" :class="$style.navSearch">
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
        :class="$style.searchBtn"
      />
      <BtnFaicon
        icon="compress-alt"
        class="nogrow clickable text"
        @click="collapseMoveCategories()"
        :class="$style.searchBtn"
      />
    </nav>

    <ul
      v-if="state.searchQuery"
      class="flexcol item-list"
      :class="$style.itemList"
    >
      <!-- Flat search results -->
      <li
        v-for="(move, resultIndex) of searchResults"
        :key="resultIndex"
        class="nogrow"
      >
        <SfMoverow :move="move" ref="allMoves" :thematicColor="move.color" />
      </li>
    </ul>

    <ul v-else class="flexcol item-list" :class="$style.itemList">
      <!-- Categorized moves if not searching -->
      <li
        v-for="(category, catIndex) in state.categories"
        :key="catIndex"
        class="nogrow"
      >
        <SfMoveCategoryRows
          class="nogrow"
          :category="category"
          ref="allCategories"
        />
      </li>
    </ul>
  </article>
</template>

<style lang="less" module>
.navSearch {
  margin-top: 0.5rem;
}
.searchBtn {
  padding: 6px;
}
.wrapper {
  gap: 0.5rem;
}
.itemList {
  scrollbar-width: thin;
  // unfortunately scrollbar properties don't behave predictably across browsers and OSs; this eases some cramping on FF
  margin: 0 -3px 0 0 !important;
  padding-right: 3px !important;
  scrollbar-gutter: stable;
  gap: 4px;
}
</style>

<script setup lang="ts">
import { computed, nextTick, provide, reactive, ref } from 'vue'
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

const flatMoves = computed(() =>
  state.categories.flatMap((category) =>
    category.moves.map((mv) => ({ ...mv, color: category.color }))
  )
)

const searchResults = computed(() => {
  if (!checkedSearchQuery.value) return null

  const re = new RegExp(checkedSearchQuery.value, 'i')
  return flatMoves.value.filter((x) => re.test(x.displayName))
})

function clearSearch() {
  state.searchQuery = ''
}

function collapseMoves() {
  for (const cat of allCategories.value ?? []) {
    cat.collapseChildren()
  }
}

function collapseMoveCategories() {
  for (const cat of allCategories.value ?? []) {
    cat.collapsible?.collapse()
  }
}

CONFIG.IRONSWORN.emitter.on('highlightMove', async (targetMoveId) => {
  clearSearch()
  await nextTick()
  for (const cat of allCategories.value ?? []) {
    cat.scrollToAndExpandChild(targetMoveId)
  }
})
</script>
