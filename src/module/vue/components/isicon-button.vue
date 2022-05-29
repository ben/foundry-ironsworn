<template>
  <button :class="classes" type="button" @click="click" :title="tooltip" />
</template>

<script>
export default {
  props: {
    icon: { type: String, required: true },
    tooltip: String,
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
