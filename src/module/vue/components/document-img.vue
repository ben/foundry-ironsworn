<template>
  <img
    :src="document.img"
    :title="document.name"
    class="profile-img"
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
      type: Number,
      default: 50,
    },
  },
}
</script>
