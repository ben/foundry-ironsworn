<template>
  <div class="flexcol">
    <div class="flexrow nogrow" style="margin-top: 0.5rem">
      <input type="text" :placeholder="$t('IRONSWORN.Search')" v-model="searchQuery" @keydown="preventSubmit" />
      <i class="fa fa-times-circle nogrow clickable text" @click="clearSearch" style="padding: 6px" />
      <i class="fa fa-compress-alt nogrow clickable text" @click="collapseAll" style="padding: 6px" />
    </div>

    <div class="flexcol item-list">
      <div class="nogrow" v-if="searchQuery">
        <sf-moverow
          v-for="move of searchResults"
          :key="move.displayName"
          :actor="actor"
          :move="move"
          @moveclick="highlightMove"
        />
      </div>
      <div class="nogrow" v-else v-for="category of categories" :key="category.$id">
        <h2>
          {{ category.displayName }}
        </h2>
        <sf-moverow
          v-for="move of category.moves"
          :key="move.displayName"
          :actor="actor"
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

<script>
import { createStarforgedMoveTree } from '../../features/custommoves'

export default {
  props: {
    actor: Object,
  },

  data() {
    return {
      searchQuery: '',
      categories: [],
    }
  },

  async created() {
    const categories = await createStarforgedMoveTree()

    // Decorate with the highlighted flag we'll need
    for (const category of categories) {
      for (const move of category.moves) {
        move.highlighted = false
      }
    }

    this.categories = categories
  },

  computed: {
    checkedSearchQuery() {
      try {
        new RegExp(this.searchQuery)
        return this.searchQuery
      } catch (error) {
        return ''
      }
    },

    flatMoves() {
      return CONFIG.IRONSWORN._.flatten(this.categories.map((x) => x.moves))
    },

    searchResults() {
      if (!this.checkedSearchQuery) return null

      const re = new RegExp(this.checkedSearchQuery, 'i')
      return this.flatMoves.filter((x) => re.test(x.displayName))
    },
  },

  methods: {
    clearSearch() {
      this.searchQuery = ''
    },

    preventSubmit(ev) {
      if (ev.keyCode == 13) {
        ev.preventDefault()
        return false
      }
    },

    collapseAll() {
      for (const row of this.$refs.allmoves ?? []) {
        row.collapse()
      }
    },

    async highlightMove(item) {
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
    },
  },
}
</script>
