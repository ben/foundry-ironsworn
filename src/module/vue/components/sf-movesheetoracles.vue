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
import { createStarforgedOracleTree } from '../../features/customoracles'

export default {
  props: {
    actor: Object,
  },

  data() {
    return {
      searchQuery: '',
      treeRoot: {children: []},
    }
  },

  async created() {
    this.treeRoot = await createStarforgedOracleTree()
  },

  computed: {
    checkedSearchQuery() {
      try {
        new RegExp(this.searchQuery)
        return this.searchQuery
      } catch (error) {
        return ''
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
  },
}
</script>
