<template>
  <btn-icon
    :class="classes"
    @click="$emit('click')"
    :tooltip="tooltip"
    :disabled="disabled"
  >
    <slot></slot>
  </btn-icon>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import BtnIcon from './btn-icon.vue'

export default defineComponent({
  props: {
    icon: { type: String, required: true },
    solid: { type: Boolean, default: true },
    tooltip: String,
    hoverBg: Boolean,
    disabled: Boolean,
  },

  emits: ['click'],

  components: {
    BtnIcon,
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
})
</script>

<style lang="less">
.icon-button {
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
