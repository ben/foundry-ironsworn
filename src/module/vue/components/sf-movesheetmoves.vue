<template>
  <div class="flexcol">
    <div class="flexrow nogrow">
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

    <div class="nogrow" v-if="searchQuery">
      <sf-moverow
        v-for="move of searchResults"
        :key="move.$id"
        :actor="actor"
        :move="move"
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
      />
    </div>
  </div>
</template>

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
  },
}
</script>
