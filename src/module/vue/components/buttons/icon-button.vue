<template>
  <button class="icon-button clickable" :class="classes" type="button" @click="click" :title="tooltip">
    <slot></slot>
  </button>
</template>

<script>
export default {
  props: {
    icon: { type: String, required: true },
    solid: { type: Boolean, default: true },
    tooltip: String,
    hoverBg: Boolean,
  },
  computed: {
    classes() {
      return {
        fas: this.solid,
        far: !this.solid,
        [`fa-${this.icon}`]: true,
        ['icon-bg-hover']: this.hoverBg,
      }
    },
  },

  methods: {
    click(event) {
      return this.$emit('click', event)
    },
  },
}
</script>

<style lang="less">
@import '../../../../styles/mixins.less';
.icon-button {
  .clickable();
  // .block();
  display: flex;
  align-items: center;
  flex-flow: row nowrap;
  flex-grow: 0;
  align-content: center;
  text-align: center;
  justify-content: center;
  padding: 0.25em;
  gap: 0.25em;
  line-height: 1;
  &:empty {
    // restricts width + removes border if there's no text
    width: 1.5em;
    border: 0;
  }
  &.fa,
  &.fas,
  &.far {
    &:not(:before) {
      -moz-osx-font-smoothing: inherit;
      -webkit-font-smoothing: inherit;
      display: inherit;
      font-style: inherit;
      font-variant: inherit;
      text-rendering: inherit;
      line-height: inherit;
      font-family: inherit;
    }
  }
}
</style>
