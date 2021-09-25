<template>
  <div class="flexrow" style="flex-wrap: nowrap">
    <rank-hex
      v-for="r in ranks"
      :key="r.rank"
      :rank="r.rank"
      :selected="r.selected"
      @click="setRank"
    />
  </div>
</template>

<script>
export default {
  props: {
    actor: {
      type: Object,
      required: true,
    },
    item: {
      type: Object,
      required: true,
    },
  },

  computed: {
    ranks() {
      const keys = Object.keys(CONFIG.IRONSWORN.Ranks)
      const position = keys.indexOf(this.item.data.rank)
      return keys.map((r) => {
        const rankIndex = keys.indexOf(r)
        const selected = rankIndex <= position
        return {
          rank: r,
          selected,
        }
      })
    },
  },

  methods: {
    setRank(_ev, rank) {
      const actor = game.actors?.get(this.actor._id)
      const item = actor?.items.get(this.item._id)
      item?.update({ data: { rank } })
    },
  },
}
</script>
