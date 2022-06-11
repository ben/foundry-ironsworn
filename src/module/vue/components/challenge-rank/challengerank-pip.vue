<template>
  <svg
    :title="title"
    role="button"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 -1 18 23"
    preserveAspectRatio="xMidYMid meet"
    class="challenge-rank-pip clickable svg"
    :aria-selected="selected"
    @click="click"
    x="19"
    y="17"
  >
    <path d="M 8.66 0 L 17.32 5 L 17.32 15 L 8.66 20 L 0 15 L 0 5 Z"></path>
  </svg>
</template>

<style lang="less">
// svg.challenge-rank-pip {
//   height: 19px;
//   width: 17px;
//   border: 0;
//   flex-grow: 0;
//   margin: 0;
//   stroke-width: 10;
//   overflow: hidden;
//   stroke: currentColor;
// }
</style>

<script>
export default {
  props: {
    rank: String,
    selected: Boolean,
  },

  computed: {
    title() {
      const i18nKey = `IRONSWORN.${this.$capitalize(this.rank)}`
      return game.i18n.localize(i18nKey)
    },
  },

  methods: {
    click(ev) {
      this.$emit('click', ev, this.rank)
    },
  },
}
</script>
