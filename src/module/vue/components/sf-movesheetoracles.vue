<template>
  <div class="flexcol" :class="$style.wrapper">
    <div class="flexrow nogrow" :class="$style.navSearch">
      <input
        type="text"
        :placeholder="
          $t('SIDEBAR.Search', { types: 'IRONSWORN.ROLLTABLES.TypeOracle' })
        "
        v-model="search.q"
        @keydown.enter.prevent
      />
      <IronBtn
        icon="fa:xmark-circle"
        class="nogrow"
        @click="clearSearch"
        :class="$style.searchBtn"
        style="padding: 6px"
      />
      <IronBtn
        icon="fa:down-left-and-up-right-to-center"
        class="nogrow"
        @click="collapseAll"
        :class="$style.searchBtn"
        style="padding: 6px"
      />
    </div>

    <div class="item-list scrollable flexcol" :class="$style.itemList">
      <OracleTreeNode
        v-for="node in treeRoot.children"
        :key="node.displayName"
        :node="node"
        ref="oracles"
      />
    </div>
  </div>
</template>

<style lang="less" module>
.wrapper {
  gap: var(--ironsworn-spacer-lg);
}

.navSearch {
  margin-top: var(--ironsworn-spacer-lg);
}

.itemList {
  padding: 0 var(--ironsworn-spacer-lg);
}
</style>

<script setup lang="ts">
import { inject, nextTick, provide, reactive, ref, watch } from 'vue'
import { findOracleWithIntermediateNodes } from '../../dataforged'
import {
  createIronswornOracleTree,
  createStarforgedOracleTree,
  IOracleTreeNode,
} from '../../features/customoracles'
import IronBtn from './buttons/iron-btn.vue'
import OracleTreeNode from './oracle-tree-node.vue'

const props = defineProps<{ toolset: 'ironsworn' | 'starforged' }>()
provide('toolset', props.toolset)

const tempTreeRoot =
  props.toolset === 'ironsworn'
    ? await createIronswornOracleTree()
    : await createStarforgedOracleTree()

const treeRoot = reactive<IOracleTreeNode>(tempTreeRoot)
type ReactiveNode = typeof treeRoot

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
    const searchWalk = (node: ReactiveNode, parentMatch: boolean): boolean => {
      // Match against current name (i18n) but also aliases in Dataforged
      let thisMatch = re.test(node.displayName)
      for (const alias of node.dataforgedNode?.Aliases ?? []) {
        thisMatch ||= re.test(alias)
      }

      // Check for descendant matches
      let childMatch = false
      for (const child of node.children) {
        childMatch ||= searchWalk(child, thisMatch || parentMatch)
      }

      // Expanded if part of a tree with a match
      node.forceExpanded = parentMatch || thisMatch || childMatch
      // Hidden if not
      node.forceHidden = !node.forceExpanded

      // Pass match up to ancestors
      return thisMatch || childMatch
    }
    searchWalk(treeRoot, false)
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

const oracles = ref<InstanceType<typeof OracleTreeNode>[]>([])

function collapseAll() {
  for (const node of oracles.value) {
    node.collapse()
  }
}

CONFIG.IRONSWORN.emitter.on('highlightOracle', async (dfid) => {
  clearSearch()

  // Find the path in the data tree
  const dfOraclePath = findOracleWithIntermediateNodes(dfid)

  // Wait for children to be present
  while (!oracles.value) {
    await nextTick()
  }

  // Walk the component tree, expanding as we go
  let children = oracles.value
  for (const dataNode of dfOraclePath) {
    const child = children?.find((x: any) => x.dfId() === dataNode.$id)
    if (!child) break
    child.expand()
    await nextTick()
    children = child.$refs.children as any
  }
})
</script>
