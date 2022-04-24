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
          @click="descriptionExpanded = !descriptionExpanded"
        />
      </h4>

      <transition name="slide">
        <with-rolllisteners
          element="div"
          :actor="actor"
          @moveclick="moveclick"
          class="flexcol"
          v-if="descriptionExpanded"
          v-html="tablePreview"
        >
        </with-rolllisteners>
      </transition>
    </div>

    <!-- Branch node -->
    <div v-else>
      <h4
        class="clickable text flexrow"
        @click="manuallyExpanded = !manuallyExpanded"
      >
        <span class="nogrow" style="flex-basis: 15px">
          <i v-if="expanded" class="fa fa-caret-down" />
          <i v-else class="fa fa-caret-right" />
        </span>
        {{ name }}
      </h4>

      <transition name="slide">
        <div class="flexcol" v-if="expanded" style="margin-left: 1rem">
          <oracletree-node
            v-for="child in children"
            :key="child.dfid"
            :actor="actor"
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
    actor: Object,
    oracle: Object,
    searchQuery: String,
    parentMatchesSearch: Boolean,
  },

  data() {
    return {
      manuallyExpanded: false,
      descriptionExpanded: false,
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
      return !(
        this.matchesSearch || // This matches
        this.parentMatchesSearch || // Parent matches
        this.childMatchesSearch
      )
    },

    tablePreview() {
      const description = this.oracle.foundryTable.data.description
      const tableRows = CONFIG.IRONSWORN._.sortBy(
        this.oracle.foundryTable.data.results.contents.map((x) => ({
          low: x.data.range[0],
          high: x.data.range[1],
          text: x.data.text,
          selected: false,
        })),
        'low'
      )
      const markdownTable = [
        '| Roll | Result |',
        '| --- | --- |',
        ...tableRows.map((x) => `| ${x.low}-${x.high} | ${x.text} |`),
      ].join('\n')

      return this.$enrichMarkdown(description + '\n\n' + markdownTable)
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

    rollOracle() {
      CONFIG.IRONSWORN.rollAndDisplayOracleResult(this.oracle.foundryTable)
    },

    moveclick(item) {
      console.log(item)
      let actorWithMoves = this.$actor
      if (this.$actor?.type !== 'character') {
        actorWithMoves = CONFIG.IRONSWORN.defaultActor()
      }
      console.log(actorWithMoves)
      actorWithMoves?.moveSheet?.render(true)
      actorWithMoves?.moveSheet?.highlightMove(item)
    },
  },
}
</script>
