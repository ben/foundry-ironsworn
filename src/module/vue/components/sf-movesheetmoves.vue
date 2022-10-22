<template>
  <div class="flexcol">
    <div class="flexrow nogrow" style="margin-top: 0.5rem">
      <input
        type="text"
        :placeholder="$t('IRONSWORN.Search')"
        v-model="state.searchQuery"
        @keydown.enter.prevent
      />
      <i
        class="fa fa-times-circle nogrow clickable text"
        @click="state.searchQuery = ''"
        style="padding: 6px"
      />
      <i
        class="fa fa-compress-alt nogrow clickable text"
        @click="collapseAll"
        style="padding: 6px"
      />
    </div>

    <div class="flexcol item-list">
      <!-- Flat search results -->
      <div class="nogrow" v-if="state.searchQuery">
        <sf-moverow v-for="(move, i) of searchResults" :key="i" :move="move" />
      </div>

      <!-- Categorized moves if not searching -->
      <div
        class="nogrow"
        v-else
        v-for="category of state.categories"
        :key="category.displayName"
      >
        <h2
          :style="`--ironsworn-color-thematic:${
            category.dataforgedCategory?.Display.Color ?? 'currentcolor'
          };`"
        >
          {{ category.displayName }}
        </h2>
        <sf-moverow
          v-for="(move, i) of category.moves"
          :key="i"
          :move="move"
          ref="allmoves"
        />
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
h2 {
  margin: 0.5rem 0 0.3rem;
  border-bottom-width: 2px;
  border-color: var(--ironsworn-color-thematic);
}
.item-list {
  padding: 0 0.5rem;
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
import sfMoverow from './sf-moverow.vue'

const props = defineProps<{ toolset: 'ironsworn' | 'starforged' }>()
provide('toolset', props.toolset)

const state = reactive({
  searchQuery: '',
  categories: [] as MoveCategory[],
})

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

const allmoves = ref<InstanceType<typeof sfMoverow>[]>([])
function collapseAll() {
  for (const row of allmoves.value ?? []) {
    row.collapse()
  }
}

CONFIG.IRONSWORN.emitter.on('highlightMove', (_item) => {
  state.searchQuery = ''
})
</script>
