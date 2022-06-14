<template>
  <icon-button :class="classes" @click="$emit('click')" :tooltip="tooltip">
    <slot></slot>
  </icon-button>
</template>

<script>
export default {
  props: {
    icon: { type: String, required: true },
    tooltip: String,
    hoverBg: Boolean,
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

<!-- see icon-button for styling -->
