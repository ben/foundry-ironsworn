<template>
  <div class="flexcol">
    <div class="flexrow nogrow" style="margin-top: 0.5rem">
      <input
        type="text"
        :placeholder="$t('IRONSWORN.Search')"
        v-model="searchQuery"
      />
      <i
        class="fa fa-times-circle nogrow clickable text"
        @click="clearSearch"
        style="padding: 6px"
      />
      <i
        class="fa fa-compress-alt nogrow clickable text"
        @click="collapseAll"
        style="padding: 6px"
      />
    </div>

    <div class="flexcol item-list">
      <oracletree-node
        v-for="node in treeRoot.children"
        :key="node.displayName"
        :actor="actor"
        :node="node"
        :searchQuery="checkedSearchQuery"
        @oracleclick="highlightOracle"
        ref="oracles"
      />
    </div>
  </div>
</template>

<style lang="less" scoped>
.item-list {
  padding: 0 0.5rem;
}
</style>

<script>
import { findOracleWithIntermediateNodes } from '../../dataforged'
import { createStarforgedOracleTree } from '../../features/customoracles'

export default {
  props: {
    actor: Object,
  },

  data() {
    return {
      searchQuery: '',
      treeRoot: { children: [] },
    }
  },

  async created() {
    const treeRoot = await createStarforgedOracleTree()
    // Add the flags we'll use for UI stuff later
    function walk(node) {
      node.forceExpanded = node.forceHidden = false
      node.children.forEach(walk)
    }
    walk(treeRoot)
    this.treeRoot = treeRoot
  },

  watch: {
    searchQuery(q) {
      // If it's not a real regex, cancel the search
      let re
      try {
        re = new RegExp(q, 'i')
      } catch {}

      if (q && re) {
        // Walk the tree and test each name.
        // Force expanded on all parent nodes leading to a match
        const walk = (node, parentMatch) => {
          const thisMatch = re.test(node.displayName)
          let childMatch = false
          for (const child of node.children) {
            childMatch |= walk(child, thisMatch || parentMatch)
          }
          node.forceExpanded = parentMatch | thisMatch | childMatch
          node.forceHidden = !node.forceExpanded
          return thisMatch | childMatch
        }
        walk(this.treeRoot, false)
      } else {
        // Walk the tree setting all force flags to false
        function resetflags(node) {
          node.forceExpanded = node.forceHidden = false
          for (const child of node.children) resetflags(child)
        }
        resetflags(this.treeRoot)
      }
    },
  },

  methods: {
    clearSearch() {
      this.searchQuery = ''
    },

    collapseAll() {
      for (const node of this.$refs.oracles) {
        node.collapse()
      }
    },

    async highlightOracle(dfid) {
      this.clearSearch()

      // Find the path in the data tree
      const dfOraclePath = findOracleWithIntermediateNodes(dfid)

      // Wait for children to be present
      while (!this.$refs.oracles) {
        await new Promise(r => setTimeout(r, 10))
      }

      // Walk the component tree, expanding as we go
      let children = this.$refs.oracles
      let lastComponent
      for (const dataNode of dfOraclePath) {
        lastComponent = children.find(x => x.node.dataforgedNode.$id === dataNode.$id)
        if (!lastComponent) break
        lastComponent.expand()
      await new Promise((r) => setTimeout(r, 50))
        children = lastComponent.$refs.children
      }

      // Visual highlight on the target
      lastComponent?.highlight()
    },
  },
}
</script>
