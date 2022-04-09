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
          :key="move.dfid"
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
          :key="move.dfid"
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
import { cloneDeep } from 'lodash'

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
    const compendiumMoves = await pack.getDocuments()
    const moves = {}
    for (const cmove of compendiumMoves) {
      const data = cloneDeep(cmove.data.data)
      data.foundryItem = cmove
      data.highlighted = false

      moves[data.Category] ||= { key: data.Category, moves: [] }
      moves[data.Category].moves.push(data)
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
          if (move.dfid === item.data.data.dfid) {
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
