<template>
  <div class="flexcol nogrow" :class="{ hidden: hidden }">
    <!-- TODO: split this into two components, yo -->
    <!-- Leaf node -->
    <div v-if="oracle.foundryTable">
      <h4 class="clickable text flexrow">
        <i
          class="fa fa-dice-d6 nogrow"
          style="flex-basis: 20px"
          @click="rollOracle"
        />
        <span @click="rollOracle">{{ name }}</span>
        <icon-button
          v-if="oracle.foundryTable"
          icon="eye"
          @click="expanded = !expanded"
        />
      </h4>

      <transition name="slide">
        <div class="flexcol" v-if="expanded" style="margin-left: 1rem">
          (table preview)
        </div>
      </transition>
    </div>

    <!-- Branch node -->
    <div v-else>
      <h4 class="clickable text flexrow">
        <span class="nogrow" style="flex-basis: 15px" @click="click">
          <i v-if="expanded" class="fa fa-caret-down" />
          <i v-else class="fa fa-caret-right" />
        </span>
        <span @click="click">{{ name }}</span>
      </h4>

      <transition name="slide">
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
      </transition>
    </div>
  </div>
</template>

<style lang="less" scoped>
.hidden {
  display: none;
}
.slide-enter-active,
.slide-leave-active {
  transition: all 0.4s ease;
  max-height: 500px;
  opacity: 1;
}
.slide-enter,
.slide-leave-to {
  max-height: 0;
  opacity: 0;
  margin-top: 0;
  margin-bottom: 0;
  padding-top: 0;
  padding-bottom: 0;
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
      return this.$refs.children?.find((x) => x.matchesSearch)
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
    click() {
      if (this.oracle.foundryTable) {
        CONFIG.IRONSWORN.rollAndDisplayOracleResult(this.oracle.foundryTable)
      } else {
        this.manuallyExpanded = !this.manuallyExpanded
      }
    },

    expandDetails() {
      this.expanded = !this.expanded
      console.log(this)
    },
  },
}
</script>
