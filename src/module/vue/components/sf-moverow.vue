<template>
  <div class="movesheet-row" :class="{ highlighted: move.highlighted }">
    <h4 class="flexrow" :title="tooltip">
      <i
        class="isicon-d10-tilt juicy clickable text nogrow"
        style="padding-right: 0.5em"
        @click="rollMove"
      ></i>
      <span class="clickable text" @click="expanded = !expanded"> {{ move.displayName }} </span>
    </h4>
    <transition name="slide">
      <with-rolllisteners
        element="div"
        class="move-summary"
        :actor="actor"
        v-if="expanded"
        @moveclick="moveclick"
      >
        <div class="flexrow">
          <button>
            <i class="isicon-d10-tilt"></i>
            Roll
          </button>
          <button>
            <i class="fas fa-comment"></i>
            Chat
          </button>
        </div>
        <div v-html="$enrichMarkdown(fulltext)" />
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
  line-height: 1.4em;
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
      return this.move.dataforgedMove?.Source?.Title
    },

    fulltext() {
      return this.move.moveItem?.data?.data?.Text
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
