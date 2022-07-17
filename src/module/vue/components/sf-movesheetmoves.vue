<template>
  <div class="flexcol">
    <div class="flexrow nogrow" style="margin-top: 0.5rem">
      <input
        type="text"
        :placeholder="$t('IRONSWORN.Search')"
        v-model="data.searchQuery"
        @keydown.enter.prevent
      />
      <i
        class="fa fa-times-circle nogrow clickable text"
        @click="data.searchQuery = ''"
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
      <div class="nogrow" v-if="data.searchQuery">
        <sf-moverow
          v-for="move of searchResults"
          :key="move.displayName"
          :move="move"
          @moveclick="highlightMove"
        />
      </div>

      <!-- Categorized moves if not searching -->
      <div
        class="nogrow"
        v-else
        v-for="category of data.categories"
        :key="category.displayName"
      >
        <h2>
          {{ category.displayName }}
        </h2>
        <sf-moverow
          v-for="move of category.moves"
          :key="move.displayName"
          :move="move"
          @moveclick="highlightMove"
          ref="allmoves"
        />
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
h2 {
  margin: 0.5rem 0 0.3rem;
}
.item-list {
  padding: 0 0.5rem;
}
</style>

<script setup lang="ts">
import { flatten } from 'lodash'
import { computed, inject, reactive, ref, Ref } from 'vue'
import { createStarforgedMoveTree } from '../../features/custommoves'
import sfMoverow from './sf-moverow.vue'

const actor = inject('actor') as Ref

const tempCategories = await createStarforgedMoveTree()
for (const category of tempCategories) {
  for (const move of category.moves) {
    move.highlighted = false
  }
}

const data = reactive({
  searchQuery: '',
  categories: tempCategories,
})

const checkedSearchQuery = computed(() => {
  try {
    new RegExp(data.searchQuery)
    return data.searchQuery
  } catch (error) {
    return ''
  }
})

const flatMoves = computed(() => {
  return flatten(data.categories.map((x) => x.moves))
})

const searchResults = computed(() => {
  if (!checkedSearchQuery.value) return null

  const re = new RegExp(checkedSearchQuery.value, 'i')
  return flatMoves.value.filter((x) => re.test(x.displayName))
})

function clearSearch() {
  data.searchQuery = ''
}

const allmoves = ref<InstanceType<typeof sfMoverow>[]>([])
function collapseAll() {
  for (const row of allmoves.value ?? []) {
    row.collapse()
  }
}

async function highlightMove(item) {
  this.searchQuery = ''
  await new Promise((r) => setTimeout(r, 10))
  for (const category of this.categories) {
    for (const move of category.moves) {
      if (move.moveItem.id === item.id) {
        move.highlighted = true
        setTimeout(() => (move.highlighted = false), 2000)
        return
      }
    }
  }

  // Not found; just open the sheet
  item.sheet?.render(true)
}
</script>
