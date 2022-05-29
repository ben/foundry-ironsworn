<template>
  <!-- TODO: refactor as component(s) -->
  <article class="moves-overview overview">
    <header class="overview-search" role="search">
      <input type="text" :placeholder="$t('IRONSWORN.Search')" v-model="searchQuery" @keydown="preventSubmit" />
      <i class="fa fa-times-circle clickable text" @click="clearSearch" />
      <i class="fa fa-compress-alt clickable text" @click="collapseAll" />
    </header>
    <ul v-if="searchQuery" role="menu" class="accordion foundry-items">
      <!-- if there's a search query, show only matched moves, with no category hierarchy -->
      <li
        role="menuitem"
        class="movesheet-row"
        v-for="move of searchResults"
        :key="move.displayName"
        :actor="actor"
        :move="move"
      >
        <sf-movetext class="movesheet-row move-text" role="menuitem" @moveclick="highlightMove" />
      </li>
    </ul>
    <ul v-else role="menu" class="accordion foundry-items">
      <li role="menuitem" class="movesheet-row" v-for="category of categories" :key="category.$id">
        <article class="move-category">
          <h1 class="h3 move-category-title">
            {{ category.displayName }}
          </h1>
          <ul>
            <li v-for="move of category.moves" :key="move.displayName + 'listitem'">
              <sf-movetext
                :key="move.displayName"
                :actor="actor"
                :move="move"
                @moveclick="highlightMove"
                ref="allmoves"
              />
            </li>
          </ul>
        </article>
      </li>
    </ul>
  </article>
</template>

<style lang="less">
.moves-overview {
  .move-category {
    .move-category-title {
      margin: 0.5rem 0 0.3rem;
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
  [role='menuitem'] {
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
