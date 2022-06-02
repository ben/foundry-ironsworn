<template>
  <!-- <div> -->
  <svg
    :title="title"
    role="button"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 -1 18 23"
    preserveAspectRatio="xMidYMid meet"
    class="rank-hex rank-pip clickable svg"
    :class="classes"
    @click="click"
    x="19"
    y="17"
  >
    <path stroke-width="1" d="M 8.66 0 L 17.32 5 L 17.32 15 L 8.66 20 L 0 15 L 0 5 Z"></path>
  </svg>
  <!-- </div> -->
</template>

<style lang="less">
.rank-hex {
  svg& {
    height: 19px;
    width: 17px;
    border: 0;
    flex-grow: 0;
    margin: 0;
    stroke-width: 10;
    overflow: hidden;
  }
}
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
    classes() {
      return {
        filled: this.selected,
      }
    },
  },

  methods: {
    click(ev) {
      this.$emit('click', ev, this.rank)
    },
  },
}
</script>
