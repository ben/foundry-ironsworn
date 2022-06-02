<template>
  <article class="overview oracle-overview">
    <form class="overview-search" role="search">
      <input type="search" :placeholder="$t('IRONSWORN.Search')" v-model="searchQuery" @keydown="preventSubmit" />
      <icon-button icon="times-circle" @click="clearSearch"></icon-button>
      <icon-button icon="compress-alt" @click="collapseAll"></icon-button>
    </form>
    <ul class="accordion foundry-items oracle-tree">
      <oracletree-node
        v-for="node in treeRoot.children"
        wrapper="li"
        :key="node.displayName"
        :actor="actor"
        :node="node"
        :searchQuery="checkedSearchQuery"
        @oracleclick="highlightOracle"
        ref="oracles"
      />
    </ul>
  </article>
</template>

<style lang="less">
@import '../../../../styles/fonts.less';
.oracle-tree {
  gap: 4px;
  & > .oracle-node-branch {
    & > .oracle-title {
      // top level oracle categories get bigger text
      .text-heading();
    }
  }
}
</style>

<script>
import { findOracleWithIntermediateNodes } from '../../../dataforged'
import { createStarforgedOracleTree } from '../../../features/customoracles'

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
          // Match against current name (i18n) but also aliases in Dataforged
          let thisMatch = re.test(node.displayName)
          for (const alias of node.dataforgedNode?.Aliases ?? []) {
            thisMatch |= re.test(alias)
          }

          // Check for descendant matches
          let childMatch = false
          for (const child of node.children) {
            childMatch |= walk(child, thisMatch || parentMatch)
          }

          // Expanded if part of a tree with a match
          node.forceExpanded = parentMatch | thisMatch | childMatch
          // Hidden if not
          node.forceHidden = !node.forceExpanded

          // Pass match up to ancestors
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

    preventSubmit(ev) {
      if (ev.keyCode == 13) {
        ev.preventDefault()
        return false
      }
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
        await new Promise((r) => setTimeout(r, 10))
      }

      // Walk the component tree, expanding as we go
      let children = this.$refs.oracles
      let lastComponent
      for (const dataNode of dfOraclePath) {
        lastComponent = children.find((x) => x.node.dataforgedNode.$id === dataNode.$id)
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
