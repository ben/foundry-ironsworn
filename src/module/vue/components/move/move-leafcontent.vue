<template>
  <expandable-article
    class="move"
    :title="move.displayName"
    :baseId="`${actor._id}-${move.moveItem.data._id}`"
    :tooltip="tooltip"
  >
    <template v-slot:header-extras> </template>
    <move-rulestext :actor="actor" :move="move" />
  </expandable-article>
</template>

<script>
export default {
  props: {
    actor: Object,
    move: Object,
  },
  watch: {
    'move.highlighted': async function (value) {
      if (value) {
        this.expanded = true
        await new Promise((r) => setTimeout(r, 200))
        this.$el.scrollIntoView()
      }
    },
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
  methods: {
    async rollMove() {
      CONFIG.IRONSWORN.SFRollMoveDialog.show(this.$actor, this.move.moveItem)
    },
    moveclick(item) {
      this.$emit('moveclick', item)
    },
    collapse() {
      this.expanded = false
    },
  },
}
</script>
