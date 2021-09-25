<template>
  <div class="flexrow nogrow" :title="title">
    <svg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      height="15"
      viewbox="0 0 17.32050807568877 20"
      :class="classes"
    >
      <path
        stroke-width="1"
        d="M8.660254037844386 0L17.32050807568877 5L17.32050807568877 15L8.660254037844386 20L0 15L0 5Z"
      ></path>
    </svg>
  </div>
</template>

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
    classes() {
      return {
        filled: this.selected,
        'rank-pip': true,
        nogrow: true,
        clickable: true,
        svg: true,
        ironsworn__progress__rank: true,
      }
    },
  },
}
</script>
