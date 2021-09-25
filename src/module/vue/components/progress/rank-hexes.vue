<template>
  <div class="flexrow">
    <rank-hex
      v-for="r in ranks"
      :key="r.rank"
      :rank="r.rank"
      :selected="r.selected"
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
}
</script>
