<template>
  <img
    :src="document.img"
    :title="document.name"
    :style="style"
    data-edit="img"
    :height="size"
    :width="size"
  />
</template>

<script>
export default {
  props: {
    document: Object,
    size: {
      type: String,
      default: '50px',
    },
  },

  computed: {
    style() {
      return {
        width: this.size,
        height: this.size,
      }
    },
  },
}
</script>
