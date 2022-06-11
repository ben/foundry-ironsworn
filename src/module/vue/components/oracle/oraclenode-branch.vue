<template>
  <component :is="wrapper" class="oracle-node-branch" aria-haspopup="true" :aria-expanded="expanded">
    <icon-button
      :id="`button-${baseId}`"
      class="toggle clickable text flexrow oracle-title"
      :aria-controls="`content-${baseId}`"
      @click="manuallyExpanded = !manuallyExpanded"
      :icon="icon"
    >
      {{ node.displayName }}
    </icon-button>
    <transition name="slide">
      <ul
        v-if="expanded"
        :id="`content-${baseId}`"
        :aria-labelledby="`button-${baseId}`"
        class="flexcol oracle-node-content"
      >
        <oracletree-node
          v-for="child in node.children"
          :wrapper="wrapper"
          :key="child.displayName"
          :actor="actor"
          :node="child"
          @oracleclick="oracleclick"
          ref="children"
        />
      </ul>
    </transition>
  </component>
</template>

<style lang="less">
@import '../../../../styles/mixins.less';
.oracle-node-branch {
  .toggle {
  }
  .oracle-node-content {
    margin-left: 1rem;
  }
}
</style>

<script>
export default {
  props: {
    actor: Object,
    node: Object,
    manuallyExpanded: Boolean,
    descriptionExpanded: Boolean,
    highlighted: Boolean,
    wrapper: String,
  },
  computed: {
    baseId() {
      // console.log(this.node.dataforgedNode.$id, this.node.children)
      return `branch-${this.node.dataforgedNode.$id.toLowerCase().replaceAll(/[\W_]/g, '-')}-${this.actor._id}`
    },
    icon() {
      return this.expanded ? 'caret-down' : 'caret-right'
    },
    expanded() {
      return this.manuallyExpanded || this.node.forceExpanded
    },
  },
  methods: {
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
  },
}
</script>
