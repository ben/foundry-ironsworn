<template>
  <div class="flexcol">
    <div class="flexrow nogrow" style="margin-top: 0.5rem">
      <input
        type="text"
        :placeholder="$t('IRONSWORN.Search')"
        v-model="search.q"
        @keydown.enter.prevent
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
      <TreeNode
        v-for="node in treeRoot.children"
        :key="node.displayName"
        :node="node"
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

<script setup lang="ts">
import { Component, reactive, ref, watch } from 'vue'
import { findOracleWithIntermediateNodes } from '../../dataforged'
import {
  createStarforgedOracleTree,
  OracleTreeNode,
} from '../../features/customoracles'
import TreeNode from './oracletree-node.vue'

const tempTreeRoot = await createStarforgedOracleTree()
// Add the flags we'll use for UI stuff later
function walk(node: OracleTreeNode) {
  node.forceExpanded = node.forceHidden = false
  node.children.forEach(walk)
}
walk(tempTreeRoot)
const treeRoot = reactive<OracleTreeNode>(tempTreeRoot)

const search = reactive({ q: '' })
watch(search, ({ q }) => {
  // If it's not a real regex, cancel the search
  let re
  try {
    re = new RegExp(q, 'i')
  } catch {}

  if (q && re) {
    // Walk the tree and test each name.
    // Force expanded on all parent nodes leading to a match
    const walk = (node: OracleTreeNode, parentMatch: boolean): boolean => {
      // Match against current name (i18n) but also aliases in Dataforged
      let thisMatch = re.test(node.displayName)
      for (const alias of node.dataforgedNode?.Aliases ?? []) {
        thisMatch ||= re.test(alias)
      }

      // Check for descendant matches
      let childMatch = false
      for (const child of node.children) {
        childMatch ||= walk(child, thisMatch || parentMatch)
      }

      // Expanded if part of a tree with a match
      node.forceExpanded = parentMatch || thisMatch || childMatch
      // Hidden if not
      node.forceHidden = !node.forceExpanded

      // Pass match up to ancestors
      return thisMatch || childMatch
    }
    walk(treeRoot, false)
  } else {
    // Walk the tree setting all force flags to false
    function resetflags(node) {
      node.forceExpanded = node.forceHidden = false
      for (const child of node.children) resetflags(child)
    }
    resetflags(treeRoot)
  }
})
function clearSearch() {
  search.q = ''
}

function collapseAll() {
  for (const node of this.$refs.oracles) {
    node.collapse()
  }
}

const oracles = ref<Component[]>([])
async function highlightOracle(dfid) {
  this.clearSearch()

  // Find the path in the data tree
  const dfOraclePath = findOracleWithIntermediateNodes(dfid)

  // Wait for children to be present
  while (!oracles.value) {
    await new Promise((r) => setTimeout(r, 10))
  }

  // Walk the component tree, expanding as we go
  let children = oracles.value
  let lastComponent
  for (const dataNode of dfOraclePath) {
    lastComponent = children.find(
      (x: any) => x.node.dataforgedNode.$id === dataNode.$id
    )
    if (!lastComponent) break
    lastComponent.expand()
    await new Promise((r) => setTimeout(r, 50))
    children = lastComponent.$refs.children
  }

  // Visual highlight on the target
  lastComponent?.highlight()
}
</script>
