<template>
  <div class="flexcol nogrow" :class="{ hidden: hidden }">
    <h4 class="clickable text" @click="click">
      <i class="fa fa-dice-d6" v-if="oracle.foundryTable" />
      <span v-else-if="expanded"><i class="fa fa-caret-down" /></span>
      <span v-else><i class="fa fa-caret-right" /></span>
      {{ name }}
    </h4>

    <div class="flexcol" v-if="expanded" style="margin-left: 1rem">
      <oracletree-node
        v-for="child in children"
        :key="child.dfid"
        :oracle="child"
        :searchQuery="searchQuery"
        :parentMatchesSearch="matchesSearch"
        ref="children"
      />
    </div>
  </div>
</template>

<style lang="less" scoped>
.hidden {
  display: none;
}
</style>

<script>
export default {
  props: {
    oracle: Object,
    searchQuery: String,
    parentMatchesSearch: Boolean,
  },

  data() {
    return {
      manuallyExpanded: false,
    }
  },

  computed: {
    children() {
      return [...(this.oracle.Categories ?? []), ...(this.oracle.Oracles ?? [])]
    },

    childMatchesSearch() {
      this.searchQuery
      return this.$refs.children?.find(x => x.matchesSearch)
    },

    expanded() {
      return this.manuallyExpanded || !!this.searchQuery
    },

    name() {
      return (
        this.oracle.foundryTable?.name ??
        this.$t(`IRONSWORN.SFOracleCategories.${this.oracle.Display.Title}`)
      )
    },

    matchesSearch() {
      const re = new RegExp(this.searchQuery, 'i')
      return re.test(this.name)
    },

    hidden() {
      if (!this.searchQuery) return false
      // todo: this or a parent or a child matches the search query
      return !(
        (
          this.matchesSearch || // This matches
          this.parentMatchesSearch || // Parent matches
          this.childMatchesSearch
        ) // Child matches
      )
    },
  },

  methods: {
    async click() {
      if (this.oracle.foundryTable) {
        this.oracle.foundryTable.draw()
      } else {
        this.manuallyExpanded = !this.manuallyExpanded
      }
    },
  },
}
</script>
