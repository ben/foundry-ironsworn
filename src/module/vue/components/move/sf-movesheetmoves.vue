<template>
  <article class="moves-overview overview">
    <!-- TODO: refactor this and the other move sheet searchbox as a component -->
    <form class="overview-search" role="search">
      <input type="search" :placeholder="$t('IRONSWORN.Search')" v-model="searchQuery" @keydown="preventSubmit" />
      <faicon-button icon="times-circle" @click="clearSearch"></faicon-button>
      <faicon-button icon="compress-alt" @click="collapseAll"></faicon-button>
    </form>

    <move-leaflist v-if="searchQuery" :actor="actor" :moves="searchResults" />

    <tree-moves v-else :categories="categories" :actor="actor" />
  </article>
</template>

<style lang="less">
.moves-overview {
  .move-category {
    border: 1px solid;
    .expand-toggle {
    }
    & > ul {
      padding-left: 0;
      & > li {
        list-style-type: none;
        ::marker {
          display: none;
        }
      }
    }
  }
  [role^='treeitem'],
  [role*=' treeitem'] {
    flex-grow: 0;
  }
}

.movesheet-row {
  ul {
    padding: 0;
  }
  .move-summary {
    border-left: 2px solid;
    margin-left: 5px;
    padding-left: 1rem;
  }
  .h4 {
    margin: 0;
  }
  .item-row {
    transition: all 0.4s ease;
  }

  .slide-enter-active,
  .slide-leave-active {
    max-height: 1000px;
  }
}
</style>

<script>
import { createStarforgedMoveTree } from '../../../features/custommoves'

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
