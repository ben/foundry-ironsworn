<template>
  <div class="flexcol">
    <div class="nogrow" v-for="ck of categoryKeys" :key="ck">
      <h2>
        {{ ck }}
      </h2>

      <div class="item-row" v-for="move of moves[ck].moves" :key="move.key">
        <h4 style="margin: 0">
          <i class="fa fa-dice-d6" />
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
    const json = await fetchJson()
    const categorizedMoves = {}
    for (const move of json) {
      categorizedMoves[move.Category] ||= { key: move.Category, moves: [] }
      categorizedMoves[move.Category].moves.push(move)
    }
    // TODO: massage
    this.moves = categorizedMoves
  },

  computed: {},
}
</script>
