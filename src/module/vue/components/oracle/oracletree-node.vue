<template>
  <oraclenode-leaf
    v-if="isLeaf"
    role="menuitem"
    :wrapper="wrapper"
    class="oracle-node flexcol nogrow movesheet-row"
    :class="{ hidden: node.forceHidden, highlighted }"
    :actor="actor"
    :node="node"
    :descriptionExpanded="descriptionExpanded"
  ></oraclenode-leaf>
  <oraclenode-branch
    v-else
    role="menuitem"
    :wrapper="wrapper"
    class="oracle-node flexcol nogrow movesheet-row"
    :class="{ hidden: node.forceHidden, highlighted }"
    :actor="actor"
    :node="node"
    :manuallyExpanded="manuallyExpanded"
    :descriptionExpanded="descriptionExpanded"
    :highlighted="highlighted"
  ></oraclenode-branch>
</template>

<style lang="less">
@import '../../../../styles/mixins.less';
.oracle-node {
  gap: 4px;

  .oracle-title {
    display: flex;
    align-items: center;
    gap: 5px;
    flex-flow: row nowrap;
    flex-grow: 1;
    justify-content: start;
    align-items: center;
    line-height: 1;
  }
  .hidden {
    display: none;
  }
  .slide-enter-active,
  .slide-leave-active {
    max-height: 1000px;
  }
}
</style>

<script>
export default {
  props: {
    actor: Object,
    node: Object,
    wrapper: String,
  },

  data() {
    return {
      manuallyExpanded: false,
      descriptionExpanded: false,
      highlighted: false,
    }
  },

  computed: {
    isLeaf() {
      return this.node.tables.length > 0
    },

    expanded() {
      return this.manuallyExpanded || this.node.forceExpanded
    },
  },

  methods: {
    moveclick(item) {
      // console.log(item)
      let actorWithMoves = this.$actor
      if (this.$actor?.type !== 'character') {
        actorWithMoves = CONFIG.IRONSWORN.defaultActor()
      }
      // console.log(actorWithMoves)
      actorWithMoves?.moveSheet?.render(true)
      actorWithMoves?.moveSheet?.highlightMove(item)
    },

    oracleclick(dfid) {
      this.$emit('oracleclick', dfid)
    },

    collapse() {
      this.manuallyExpanded = false
      this.descriptionExpanded = false
      for (const child of this.$refs.children ?? []) {
        child.collapse()
      }
    },

    expand() {
      this.manuallyExpanded = true
    },

    async highlight() {
      this.highlighted = true
      this.$el.scrollIntoView()
      await new Promise((r) => setTimeout(r, 2000))
      this.highlighted = false
    },
  },
}
</script>
