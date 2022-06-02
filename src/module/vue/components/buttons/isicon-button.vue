<template>
  <button
    class="clickable block icon-button"
    :class="`isicon-${this.icon}`"
    type="button"
    @click="click"
    :title="tooltip"
  >
    <slot></slot>
  </button>
</template>

<script>
export default {
  props: {
    icon: { type: String, required: true },
    tooltip: String,
  },

  methods: {
    click(event) {
      return this.$emit('click', event)
    },
  },
}
</script>

<!-- see icon-button for styling -->
