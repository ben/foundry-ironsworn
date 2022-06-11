<template>
  <img class="doc-img" :src="document.img" :title="document.name" data-edit="img" :height="size" :width="size" />
</template>

<style lang="less">
.doc-img {
  flex-basis: 0;
}
</style>

<script>
export default {
  props: {
    document: Object,
    size: {
      type: String,
      default: '50px',
    },
  },
}
</script>
