<template>
  <div class="flexcol">
    <div class="nogrow" v-for="ck of categoryKeys" :key="ck">
      <h2>
        {{ ck }}
      </h2>

      <div class="item-row" v-for="move of movesForKey(ck)" :key="move.key">
        <h4 style="margin: 0" >
          <i class="fa fa-dice-d6 clickable text" @click="rollMove(move)" />
          {{ move.Name }}
        </h4>
      </div>
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
      // TODO: use compendium IDs or datasworn $id's here
      move.foundryItem = compendiumMoves.find(x => x.name === move.Name)
      moves[move.Category] ||= { key: move.Category, moves: [] }
      moves[move.Category].moves.push(move)
    }
    this.moves = moves
  },

  computed: {},

  methods: {
    movesForKey(ck) {
      return this.moves[ck]?.moves
    },

    async rollMove(moveData) {
      CONFIG.IRONSWORN.RollDialog.show({
        actor: this.$actor,
        move: moveData.foundryItem.getMoveData(),
      })
    },
  },
}
</script>
