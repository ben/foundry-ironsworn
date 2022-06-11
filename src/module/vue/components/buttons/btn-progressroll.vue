<template>
  <isicon-button
    @click="rollProgress()"
    :title="tooltip"
    class="opens-dialog progress-roll"
    :class="attr"
    icon="d10-tilt"
  >
    <slot></slot>
  </isicon-button>
</template>

<script>
export default {
  props: {
    item: Object, // the progress track
    tooltip: String,
  },
  methods: {
    rollProgress() {
      this.$item.fulfill()
    },
  },
}
</script>
