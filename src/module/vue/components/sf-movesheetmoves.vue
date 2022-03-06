<template>
  <div class="flexcol">
    <div class="flexrow nogrow" style="margin-top: 0.5rem">
      <input
        type="text"
        :placeholder="$t('IRONSWORN.Search')"
        v-model="searchQuery"
      />
      <i
        class="fa fa-times-circle nogrow clickable text"
        @click="clearSearch"
        style="padding: 6px"
      />
    </div>

    <div class="flexcol item-list">
      <div class="nogrow" v-if="searchQuery">
        <sf-moverow
          v-for="move of searchResults"
          :key="move.$id"
          :actor="actor"
          :move="move"
          @moveclick="highlightMove"
        />
      </div>
      <div class="nogrow" v-else v-for="ck of categoryKeys" :key="ck">
        <h2>
          {{ ck }}
        </h2>
        <sf-moverow
          v-for="move of movesForKey(ck)"
          :key="move.$id"
          :actor="actor"
          :move="move"
          @moveclick="highlightMove"
        />
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
h2 {
  border-color: white;
  background-color: #888;
  color: white;
  margin: 0.3rem 0;
}
.item-list {
  padding: 0 0.5rem;
}
</style>

<script>
async function fetchJson() {
  return fetch('systems/foundry-ironsworn/assets/sf-moves.json').then((x) =>
    x.json()
  )
}

export default {
  props: {
    actor: Object,
  },

  data() {
    return {
      searchQuery: '',
      moves: {},
      categoryKeys: [
        'Session Moves',
        'Adventure Moves',
        'Quest Moves',
        'Connection Moves',
        'Exploration Moves',
        'Combat Moves',
        'Suffer Moves',
        'Threshold Moves',
        'Recover Moves',
        'Legacy Moves',
        'Fate Moves',
      ],
    }
  },

  async created() {
    const pack = game.packs.get('foundry-ironsworn.starforgedmoves')
    const [json, compendiumMoves] = await Promise.all([
      fetchJson(),
      pack.getDocuments(),
    ])
    const moves = {}
    for (const move of json) {
      move.foundryItem = compendiumMoves.find(
        (x) => x.data.data.sourceId === move['$id']
      )
      move.highlighted = false
      moves[move.Category] ||= { key: move.Category, moves: [] }
      moves[move.Category].moves.push(move)
    }
    this.moves = moves
  },

  computed: {
    sortedMoves() {
      const ret = []
      for (const category of Object.keys(this.moves || {})) {
        ret.push(...this.moves[category].moves)
      }
      return ret
    },

    searchResults() {
      if (!this.searchQuery) return null

      const re = new RegExp(this.searchQuery, 'i')
      return this.sortedMoves.filter((x) => re.test(x.foundryItem.name))
    },
  },

  methods: {
    movesForKey(ck) {
      return this.moves[ck]?.moves
    },

    clearSearch() {
      this.searchQuery = ''
    },

    async highlightMove(item) {
      this.searchQuery = ''
      await new Promise(r => setTimeout(r, 10))
      // TODO: this doesn't support custom moves
      for (const k of Object.keys(this.moves)) {
        const moveCategory = this.moves[k]
        for (const move of moveCategory.moves) {
          if (move.$id === item.data.data.sourceId) {
            move.highlighted = true
            setTimeout(() => move.highlighted = false, 2000)
            return
          }
        }
      }

      // Not found; just open the sheet
      item.sheet?.render(true)
    }
  },
}
</script>
