<template>
  <with-rolllisteners :actor="actor" element="section" class="move-rules-text" v-html="$enrichMarkdown(fulltext)">
  </with-rolllisteners>
</template>
<style lang="less">
.move-rules-text {
  display: flex;
  flex-flow: column nowrap;
  gap: 0.5rem;
  padding: 0.5rem;
}
</style>
<script>
export default {
  props: {
    actor: Object,
    move: Object,
  },
  computed: {
    fulltext() {
      return this.move.moveItem?.data?.data?.Text
    },
    tooltip() {
      let result = this.move.dataforgedMove?.Source?.Title
      if (this.move.dataforgedMove?.Source?.Page) {
        result += `, p. ${this.move.dataforgedMove?.Source?.Page}`
      }
      return result
    },
  },
}
</script>
