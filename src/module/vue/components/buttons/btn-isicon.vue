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

<script>
export default {
  props: {
    icon: { type: String, required: true },
    tooltip: String,
    hoverBg: Boolean,
    disabled: Boolean,
  },
  computed: {
    classes() {
      return {
        [`isicon-${this.icon}`]: true,
        ['icon-bg-hover']: this.hoverBg,
      }
    },
  },
}
</script>
