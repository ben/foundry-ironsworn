<template>
  <div class="flexcol nogrow" :class="{ hidden: hidden }">
    <!-- TODO: split this into two components, yo -->
    <!-- Leaf node -->
    <div v-if="node.table">
      <h4 class="clickable text flexrow">
        <span @click="rollOracle">
          <i class="isicon-d10-tilt juicy"></i>
          {{ node.displayName }}
        </span>
        <icon-button
          v-if="node.table"
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
        {{ node.displayName }}
      </h4>

      <transition name="slide">
        <div class="flexcol" v-if="expanded" style="margin-left: 1rem">
          <oracletree-node
            v-for="child in node.children"
            :key="child.displayName"
            :actor="actor"
            :node="child"
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
h4 {
  margin-bottom: 4px;
}
.hidden {
  display: none;
}
.slide-enter-active,
.slide-leave-active {
  max-height: 1000px;
}
</style>

<script>
export default {
  props: {
    actor: Object,
    node: Object,
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
    childMatchesSearch() {
      return this.$refs.children?.find((x) => x.matchesSearch)
    },

    expanded() {
      return this.manuallyExpanded || !!this.searchQuery
    },

    matchesSearch() {
      const re = new RegExp(this.searchQuery, 'i')
      return re.test(this.node.displayName)
    },

    hidden() {
      if (!this.searchQuery) return false
      return !(
        this.matchesSearch ||
        this.parentMatchesSearch ||
        this.childMatchesSearch
      )
    },

    tablePreview() {
      const description = this.node.table.data.description || ''
      const tableRows = CONFIG.IRONSWORN._.sortBy(
        this.node.table.data.results.contents.map((x) => ({
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
    rollOracle() {
      CONFIG.IRONSWORN.rollAndDisplayOracleResult(this.node.table)
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

    collapse() {
      this.manuallyExpanded = false
      this.descriptionExpanded = false
      for (const child of this.$refs.children ?? []) {
        child.collapse()
      }
    },
  },
}
</script>
