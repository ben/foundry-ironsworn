<template>
  <div :title="title" :aria-label="title" :data-tooltip="title" class="nogrow">
    <svg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      viewbox="-1 -1 17 15"
      height="20px"
      width="18px"
      class="rank-pip clickable svg"
      :class="classes"
      @click="click"
    >
      <path
        stroke-width="1"
        d="M 8.66 0 L 17.32 5 L 17.32 15 L 8.66 20 L 0 15 L 0 5 Z"
      ></path>
    </svg>
  </div>
</template>

<style lang="less" scoped>
div {
  width: 14px;
  height: 20px;
  padding: 0 1px;

  svg {
    margin: 0;
    transform: scale(0.7);
    transform-origin: top left;
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
