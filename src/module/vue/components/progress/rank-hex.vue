<template>
  <div :title="title" class="nogrow">
    <svg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      viewbox="0 0 17 15"
      class="rank-pip clickable svg"
      :class="classes"
      @click="click"
    >
      <path
        stroke-width="1"
        d="M 7.5 0 L 15 5 L 15 13 L 7.5 18 L 1 13 L 1 5 Z"
      ></path>
    </svg>
  </div>
</template>

<style lang="less" scoped>
div {
  width: 17px;
  height: 15px;
  padding: 0 1px;
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
    }
  }
}
</script>
