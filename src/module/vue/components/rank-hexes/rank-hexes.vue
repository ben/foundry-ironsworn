<template>
  <fieldset class="rank-hexes">
    <rank-hex v-for="r in ranks" :key="r.rank" :rank="r.rank" :selected="r.selected" @click="click(r.rank)" />
  </fieldset>
</template>
<style lang="less">
.rank-hexes {
  display: flex;
  flex-flow: row nowrap;
  width: max-content;
  height: max-content;
}
</style>
<script>
export default {
  props: {
    current: String,
  },

  computed: {
    ranks() {
      const keys = Object.keys(CONFIG.IRONSWORN.Ranks)
      const position = keys.indexOf(this.current)
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
    click(rank) {
      this.$emit('click', rank)
    },
  },
}
</script>
