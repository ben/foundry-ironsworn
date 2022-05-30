<template>
  <button class="clickable block icon-button" :class="classes" type="button" @click="click" :title="tooltip">
    <slot></slot>
  </button>
</template>

<script>
export default {
  props: {
    icon: { type: String, required: true },
    solid: { type: Boolean, default: true },
    tooltip: String,
    textContent: String,
  },

  computed: {
    classes() {
      return {
        fas: this.solid,
        far: !this.solid,
        [`fa-${this.icon}`]: true,
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
@import '../../../styles/mixins.less';
.icon-button {
  border: none;
  flex-grow: 0;
  background: none;
  align-content: center;
  text-align: center;
  justify-content: center;
  padding: 3px;
  &:empty {
    // only restricts width if there's no text or other elements in the button.
    width: 22px;
  }
  &.fa,
  &.fas,
  &.far {
    &:not(:before) {
      -moz-osx-font-smoothing: unset;
      -webkit-font-smoothing: unset;
      display: unset;
      font-style: unset;
      font-variant: unset;
      text-rendering: unset;
      line-height: unset;
      font-family: unset;
    }
  }
}
</style>
