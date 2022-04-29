<template>
  <div :class="{ highlighted: move.highlighted }">
    <h4 style="margin: 0" class="clickable text flexrow" :title="tooltip">
      <span @click="rollMove">
        <die-icon class="clickable svg" />
        {{ move.foundryItem.name }}
      </span>
      <icon-button icon="eye" @click="expanded = !expanded" />
    </h4>
    <transition name="slide">
      <with-rolllisteners
        element="div"
        class="move-summary"
        :actor="actor"
        v-if="expanded"
        @moveclick="moveclick"
      >
        <div v-html="$enrichMarkdown(move.foundryItem.data.Text)" />
      </with-rolllisteners>
    </transition>
  </div>
</template>

<style lang="less" scoped>
.move-summary {
  border-left: 2px solid;
  margin-left: 5px;
  padding-left: 1rem;
}
h4 {
  margin: 0;
}
i.fa-dice-d6 {
  padding-right: 0.5rem;
}

.item-row {
  transition: all 0.4s ease;
}

.slide-enter-active,
.slide-leave-active {
  max-height: 1000px;
}
</style>

<script>
export default {
  props: {
    actor: Object,
    move: Object,
  },

  data() {
    return {
      expanded: false,
    }
  },

  computed: {
    tooltip() {
      // TODO: page number, when it shows up
      return this.move.Source?.Title
    },

    fulltext() {
      return this.move.foundryItem?.data?.data?.fulltext
    },
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

  methods: {
    async rollMove() {
      const move =
        await CONFIG.IRONSWORN.dataforgedHelpers.getFoundryMoveByDfId(
          this.move.$id
        )
      CONFIG.IRONSWORN.SFRollMoveDialog.show(this.$actor, move)
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
