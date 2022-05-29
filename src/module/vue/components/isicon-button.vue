<template>
  <button :class="classes" type="button" @click="click" :title="tooltip">
    <slot></slot>
  </button>
</template>

<script>
export default {
  props: {
    icon: { type: String, required: true },
    tooltip: String,
    textContent: String,
  },

  computed: {
    classes() {
      return {
        [`isicon-${this.icon}`]: true,
        ['icon-button']: true,
        clickable: true,
        block: true,
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
