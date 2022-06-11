<template>
  <with-rolllisteners :actor="actor" :element="element" class="move-rules-text" v-html="$enrichMarkdown(fulltext)">
  </with-rolllisteners>
</template>
<style lang="less">
.move-rules-text {
}
</style>
<script>
export default {
  props: {
    actor: Object,
    move: Object,
    element: { type: String, default: 'section' },
  },
  computed: {
    fulltext() {
      return this.move.moveItem?.data?.data?.Text
    },
  },
}
</script>
