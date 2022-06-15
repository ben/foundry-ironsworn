<template>
  <btn-isicon
    @click="rollProgress()"
    :tooltip="tooltip"
    class="progress-roll"
    :class="attr"
    icon="d10-tilt"
  >
    <slot></slot>
  </btn-isicon>
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
