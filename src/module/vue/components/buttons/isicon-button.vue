<template>
  <button class="icon-button clickable" :class="classes" type="button" @click="click" :title="tooltip">
    <slot></slot>
  </button>
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
  methods: {
    click(event) {
      return this.$emit('click', event)
    },
  },
}
</script>

<!-- see icon-button for styling -->
