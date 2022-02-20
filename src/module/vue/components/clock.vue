<template>
  <svg
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    height="100"
    width="100"
    viewBox="0 0 100 100"
  >
    <circle r="50" cx="50" cy="50" fill="gray" class="clickable svg" />
  </svg>
</template>

<script>
export default {
  props: {
    wedges: {
      type: Number,
      default: 6,
    },
    ticked: {
      type: Number,
      default: 2,
    },
  },
}
</script>
